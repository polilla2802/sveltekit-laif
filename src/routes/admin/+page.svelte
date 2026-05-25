<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { categoryData as staticData } from '$utils/categoryData';
	import type { FirebaseStorage } from 'firebase/storage';

	const ADMIN_PASSWORD = 'laif2026';

	// Auth
	let authenticated = false;
	let passwordInput = '';
	let authError = '';
	let showPassword = false;

	// Firebase Storage (solo para subir archivos)
	let storage: FirebaseStorage | null = null;

	// Stats
	let activeVisitors = 0;
	let visitorPollInterval: ReturnType<typeof setInterval>;

	// Estado de la conexión con la DB
	let dbReady = false;
	let dbError = '';

	type VideoEntry = {
		key: string;
		title: string;
		icon: string;
		bgColor: string;
		mainVideoSrc: string;
		altVideoSrc: string;
		savedMain: string;
		savedAlt: string;
		uploading: boolean;
		uploadProgress: number;
		saving: boolean;
		saved: boolean;
		error: string;
	};

	let entries: VideoEntry[] = Object.entries(staticData).map(([key, val]) => ({
		key,
		title: val.title,
		icon: val.icon,
		bgColor: val.bgColor,
		mainVideoSrc: val.mainVideoSrc,
		altVideoSrc: val.altVideoSrc,
		savedMain: val.mainVideoSrc,
		savedAlt: val.altVideoSrc,
		uploading: false,
		uploadProgress: 0,
		saving: false,
		saved: false,
		error: ''
	}));

	// ─── Auth ───────────────────────────────────────────
	const SESSION_KEY = 'laif-admin-session';
	const SESSION_TTL = 24 * 60 * 60 * 1000;

	function saveSession() {
		localStorage.setItem(SESSION_KEY, String(Date.now()));
	}

	function clearSession() {
		localStorage.removeItem(SESSION_KEY);
	}

	function checkSession(): boolean {
		const ts = localStorage.getItem(SESSION_KEY);
		if (!ts) return false;
		return Date.now() - Number(ts) < SESSION_TTL;
	}

	function login() {
		if (passwordInput === ADMIN_PASSWORD) {
			saveSession();
			authenticated = true;
			authError = '';
			initDashboard();
		} else {
			authError = 'Contraseña incorrecta';
		}
	}

	function logout() {
		clearSession();
		clearInterval(visitorPollInterval);
		authenticated = false;
		storage = null;
	}

	function onPasswordKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') login();
	}

	onMount(() => {
		if (checkSession()) {
			authenticated = true;
			initDashboard();
		}
	});

	// ─── Dashboard init ──────────────────────────────────
	async function initDashboard() {
		try {
			// Cargar URLs desde CockroachDB via API
			const res = await fetch('/api/video-urls');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const saved: Record<string, { mainVideoSrc: string; altVideoSrc: string }> = await res.json();

			entries = entries.map((e) =>
				saved[e.key]
					? {
							...e,
							mainVideoSrc: saved[e.key].mainVideoSrc,
							altVideoSrc: saved[e.key].altVideoSrc,
							savedMain: saved[e.key].mainVideoSrc,
							savedAlt: saved[e.key].altVideoSrc
						}
					: e
			);

			dbReady = true;
			dbError = '';

			// Inicializar Firebase Storage para subidas
			const firebase = await import('$lib/firebase/firebase.client');
			storage = firebase.storage;

			// Polling de visitantes activos cada 10 s
			await pollVisitors();
			visitorPollInterval = setInterval(pollVisitors, 10000);
		} catch (err) {
			dbReady = false;
			dbError = err instanceof Error ? err.message : 'No se pudo conectar con la base de datos.';
		}
	}

	async function pollVisitors() {
		try {
			const res = await fetch('/api/presence');
			if (res.ok) {
				const data = await res.json();
				activeVisitors = data.count ?? 0;
			}
		} catch {
			// ignorar errores de red en el poll
		}
	}

	// ─── Guardar URL manualmente ─────────────────────────
	async function saveEntry(i: number) {
		const key = entries[i].key;
		const mainVideoSrc = entries[i].mainVideoSrc.trim();
		const altVideoSrc = entries[i].altVideoSrc.trim();

		entries[i] = { ...entries[i], saving: true, saved: false, error: '' };

		try {
			const res = await fetch('/api/video-urls', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, mainVideoSrc, altVideoSrc })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);

			entries[i] = {
				...entries[i],
				saving: false,
				saved: true,
				savedMain: mainVideoSrc,
				savedAlt: altVideoSrc,
				error: ''
			};
			setTimeout(() => {
				entries[i] = { ...entries[i], saved: false };
			}, 2500);
		} catch (err) {
			entries[i] = {
				...entries[i],
				saving: false,
				error: err instanceof Error ? err.message : 'Error al guardar'
			};
		}
	}

	// ─── Subida de archivo a Firebase Storage ────────────
	async function handleUpload(i: number, event: Event) {
		if (!storage) return;

		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		input.value = '';

		const ext = file.name.substring(file.name.lastIndexOf('.'));
		const path = `videos/${entries[i].key}${ext}`;

		entries[i] = { ...entries[i], uploading: true, uploadProgress: 0, error: '' };

		try {
			const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
			const storageRef = ref(storage, path);
			const task = uploadBytesResumable(storageRef, file);

			task.on(
				'state_changed',
				(snap) => {
					const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
					entries[i] = { ...entries[i], uploadProgress: pct };
				},
				(err) => {
					entries[i] = { ...entries[i], uploading: false, error: err.message };
				},
				async () => {
					const url = await getDownloadURL(task.snapshot.ref);
					entries[i] = {
						...entries[i],
						mainVideoSrc: url,
						altVideoSrc: url,
						uploading: false,
						uploadProgress: 0
					};
					// Auto-guardar la nueva URL en CockroachDB
					await saveEntry(i);
				}
			);
		} catch (err) {
			entries[i] = {
				...entries[i],
				uploading: false,
				error: err instanceof Error ? err.message : 'Error al iniciar la subida'
			};
		}
	}

	// ─── Restaurar valor por defecto ─────────────────────
	function resetEntry(i: number) {
		const original = Object.entries(staticData)[i];
		if (!original) return;
		const [, val] = original;
		entries[i] = {
			...entries[i],
			mainVideoSrc: val.mainVideoSrc,
			altVideoSrc: val.altVideoSrc,
			error: ''
		};
	}

	function isDirty(i: number) {
		return (
			entries[i].mainVideoSrc !== entries[i].savedMain ||
			entries[i].altVideoSrc !== entries[i].savedAlt
		);
	}

	onDestroy(() => clearInterval(visitorPollInterval));
</script>

<!-- ═══════════════════════════════════════════════════════ -->
<!--  LOGIN                                                  -->
<!-- ═══════════════════════════════════════════════════════ -->
{#if !authenticated}
	<div class="login-screen">
		<div class="login-card">
			<img src="/logos/laif-logo.png" alt="Laif" class="login-logo" />
			<h1>Panel de Administración</h1>
			<div class="field">
				<div class="password-wrap">
					{#if showPassword}
						<input
							type="text"
							placeholder="Contraseña"
							bind:value={passwordInput}
							on:keydown={onPasswordKeydown}
							autocomplete="current-password"
						/>
					{:else}
						<input
							type="password"
							placeholder="Contraseña"
							bind:value={passwordInput}
							on:keydown={onPasswordKeydown}
							autocomplete="current-password"
						/>
					{/if}
					<button
						type="button"
						class="eye-btn"
						on:click={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
					>
						{#if showPassword}
							<!-- ojo abierto -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
								<circle cx="12" cy="12" r="3"/>
							</svg>
						{:else}
							<!-- ojo tachado -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
								<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
								<line x1="1" y1="1" x2="23" y2="23"/>
							</svg>
						{/if}
					</button>
				</div>
				{#if authError}<p class="field-error">{authError}</p>{/if}
			</div>
			<button class="btn-primary" on:click={login}>Entrar</button>
		</div>
	</div>

<!-- ═══════════════════════════════════════════════════════ -->
<!--  DASHBOARD                                             -->
<!-- ═══════════════════════════════════════════════════════ -->
{:else}
	<div class="shell">
		<!-- Header -->
		<header class="top-bar">
			<img src="/logos/laif-logo.png" alt="Laif" class="bar-logo" />
			<span class="bar-title">Panel de Administración</span>

			{#if dbReady}
				<div class="visitors-pill">
					<span class="live-dot"></span>
					<strong>{activeVisitors}</strong>
					<span>visitantes activos</span>
				</div>
			{:else}
				<div class="visitors-pill error-pill">
					<span>⚠ Sin conexión a Firestore</span>
				</div>
			{/if}
			<button class="btn-logout" on:click={logout}>Cerrar sesión</button>
		</header>

		<div class="content">
			<!-- Error de conexión global -->
			{#if dbError}
				<div class="alert-box">
					<strong>Error de base de datos:</strong> {dbError}
				</div>
			{/if}

			<!-- Cabecera de sección -->
			<div class="section-head">
				<h2>Videos por Segmento</h2>
				<p>
					Edita la URL o sube un archivo. Los cambios se guardan en CockroachDB y la app los
					carga automáticamente.
				</p>
			</div>

			<!-- Grid de tarjetas -->
			<div class="grid">
				{#each entries as entry, i (entry.key)}
					<div class="card" style="border-top: 4px solid {entry.bgColor}">
						<!-- Cabecera de tarjeta -->
						<div class="card-header">
							<img src={entry.icon} alt={entry.title} class="seg-icon" />
							<h3>{entry.title}</h3>
							{#if isDirty(i)}
								<span class="dirty-badge">sin guardar</span>
							{/if}
						</div>

						<!-- URL principal -->
						<div class="field">
							<label for="main-{entry.key}">Video principal</label>
							<input
								id="main-{entry.key}"
								type="url"
								placeholder="https://… (YouTube, Twitch, Firebase Storage)"
								bind:value={entries[i].mainVideoSrc}
							/>
						</div>

						<!-- URL alternativa -->
						<div class="field">
							<label for="alt-{entry.key}">Video alternativo</label>
							<input
								id="alt-{entry.key}"
								type="url"
								placeholder="https://…"
								bind:value={entries[i].altVideoSrc}
							/>
						</div>

						<!-- Barra de progreso de subida -->
						{#if entry.uploading}
							<div class="upload-status">
								<div class="progress-track">
									<div class="progress-bar" style="width:{entry.uploadProgress}%"></div>
								</div>
								<span class="progress-label">{entry.uploadProgress}%</span>
							</div>
						{/if}

						<!-- Error por tarjeta -->
						{#if entry.error}
							<p class="card-error">⚠ {entry.error}</p>
						{/if}

						<!-- Acciones -->
						<div class="card-actions">
							<!-- Subir archivo -->
							<label
								class="btn-upload"
								class:disabled={entry.uploading || !dbReady}
								title={!dbReady ? 'Base de datos no conectada' : ''}
							>
								{#if entry.uploading}
									Subiendo…
								{:else}
									↑ Subir archivo
								{/if}
								<input
									type="file"
									accept="video/*,video/mp4,video/webm,video/ogg"
									hidden
									on:change={(e) => handleUpload(i, e)}
									disabled={entry.uploading || !dbReady}
								/>
							</label>

							<!-- Restaurar -->
							<button
								class="btn-reset"
								on:click={() => resetEntry(i)}
								title="Restaurar URL original del código fuente"
								disabled={entry.uploading || entry.saving}
							>
								↩ Reset
							</button>

							<!-- Guardar -->
							<button
								class="btn-save"
								class:is-saving={entry.saving}
								class:is-saved={entry.saved}
								on:click={() => saveEntry(i)}
								disabled={entry.saving || entry.uploading || !dbReady}
							>
								{#if entry.saving}
									Guardando…
								{:else if entry.saved}
									✓ Guardado
								{:else}
									Guardar
								{/if}
							</button>
						</div>

						<!-- URL actualmente en producción -->
						{#if entry.savedMain && entry.savedMain !== staticData[entry.key]?.mainVideoSrc}
							<details class="saved-url-info">
								<summary>URL guardada en Firestore</summary>
								<p class="saved-url">{entry.savedMain}</p>
							</details>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	/* ── Password toggle ────────────────────── */
	.password-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}
	.password-wrap input {
		padding-right: 2.75rem !important;
		width: 100%;
	}
	.eye-btn {
		position: absolute;
		right: 0.75rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: #666;
		display: flex;
		align-items: center;
		transition: color 0.15s;
		flex-shrink: 0;
	}
	.eye-btn:hover { color: #aaa; }
	.eye-btn svg { width: 18px; height: 18px; }

	/* ── Login ───────────────────────────────── */
	.login-screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0d0d0d;
		padding: 1.5rem;
	}
	.login-card {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 20px;
		padding: 2.5rem 2rem;
		width: 100%;
		max-width: 380px;
		text-align: center;
	}
	.login-logo {
		width: 72px;
		margin: 0 auto 1.5rem;
		display: block;
	}
	.login-card h1 {
		color: #fff;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 2.5px;
		margin: 0 0 1.75rem;
	}

	/* ── Shell ───────────────────────────────── */
	.shell {
		min-height: 100vh;
		background: #0d0d0d;
		color: #fff;
	}

	/* ── Top bar ─────────────────────────────── */
	.top-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1.5rem;
		background: #161616;
		border-bottom: 1px solid #2a2a2a;
		flex-wrap: wrap;
	}
	.bar-logo { width: 36px; flex-shrink: 0; }
	.btn-logout {
		background: none;
		border: 1px solid #3a3a3a;
		border-radius: 50px;
		padding: 0.3rem 0.85rem;
		color: #777;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.18s;
		flex-shrink: 0;
	}
	.btn-logout:hover {
		border-color: #666;
		color: #bbb;
	}
	.bar-title {
		flex: 1;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: #ddd;
	}
	.visitors-pill {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		background: #1e2a1e;
		border: 1px solid #2e4a2e;
		border-radius: 50px;
		padding: 0.35rem 0.9rem;
		font-size: 0.78rem;
		color: #7dba7d;
	}
	.error-pill {
		background: #2a1e1e;
		border-color: #4a2e2e;
		color: #ba7d7d;
	}
	.live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #4caf50;
		flex-shrink: 0;
		animation: blink 2s ease infinite;
	}
	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.35; }
	}

	/* ── Content ─────────────────────────────── */
	.content {
		padding: 1.75rem 1.5rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	/* ── Alert box ───────────────────────────── */
	.alert-box {
		background: #2a1a1a;
		border: 1px solid #5a2a2a;
		border-radius: 10px;
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
		font-size: 0.8rem;
		color: #e09090;
		line-height: 1.6;
	}

	/* ── Section head ────────────────────────── */
	.section-head { margin-bottom: 1.5rem; }
	.section-head h2 {
		color: #fff;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin: 0 0 0.3rem;
	}
	.section-head p { color: #666; font-size: 0.78rem; margin: 0; }

	/* ── Grid ────────────────────────────────── */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.1rem;
	}

	/* ── Card ────────────────────────────────── */
	.card {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 12px;
		padding: 1.1rem 1.1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.card-header {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}
	.seg-icon {
		width: 32px;
		height: 32px;
		object-fit: contain;
		border-radius: 6px;
		flex-shrink: 0;
	}
	.card-header h3 {
		color: #fff;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0;
		flex: 1;
	}
	.dirty-badge {
		font-size: 0.65rem;
		background: #3a2e14;
		border: 1px solid #7a5a14;
		color: #d4a84b;
		border-radius: 50px;
		padding: 0.15rem 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		flex-shrink: 0;
	}

	/* ── Fields ──────────────────────────────── */
	.field { display: flex; flex-direction: column; gap: 0.25rem; }
	.field label {
		font-size: 0.67rem;
		color: #777;
		text-transform: uppercase;
		letter-spacing: 0.8px;
	}
	.field input {
		background: #222;
		border: 1px solid #383838;
		border-radius: 8px;
		padding: 0.55rem 0.75rem;
		color: #eee;
		font-size: 0.8rem;
		outline: none;
		transition: border-color 0.18s;
		width: 100%;
		font-family: inherit;
	}
	.field input:focus {
		border-color: #758a6b;
	}
	.field-error {
		color: #ff7070;
		font-size: 0.75rem;
		margin: 0.3rem 0 0;
		text-align: left;
	}
	.card-error {
		font-size: 0.72rem;
		color: #ff7070;
		margin: 0;
		background: #2a1a1a;
		border: 1px solid #5a2a2a;
		border-radius: 6px;
		padding: 0.4rem 0.6rem;
	}

	/* ── Upload progress ─────────────────────── */
	.upload-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.progress-track {
		flex: 1;
		height: 5px;
		background: #2a2a2a;
		border-radius: 5px;
		overflow: hidden;
	}
	.progress-bar {
		height: 100%;
		background: #758a6b;
		border-radius: 5px;
		transition: width 0.25s;
	}
	.progress-label {
		font-size: 0.72rem;
		color: #888;
		min-width: 30px;
		text-align: right;
	}

	/* ── Card actions ────────────────────────── */
	.card-actions {
		display: flex;
		gap: 0.4rem;
		margin-top: 0.1rem;
	}

	.btn-upload {
		flex: 1.6;
		padding: 0.6rem 0.5rem;
		border-radius: 8px;
		border: 1px dashed #444;
		background: transparent;
		color: #999;
		font-size: 0.72rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.18s;
		font-family: inherit;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.btn-upload:hover:not(.disabled) {
		border-color: #758a6b;
		color: #8fa483;
	}
	.btn-upload.disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}

	.btn-reset {
		padding: 0.6rem 0.65rem;
		border-radius: 8px;
		border: 1px solid #383838;
		background: transparent;
		color: #777;
		font-size: 0.72rem;
		cursor: pointer;
		transition: all 0.18s;
		font-family: inherit;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		white-space: nowrap;
	}
	.btn-reset:hover:not(:disabled) {
		border-color: #666;
		color: #aaa;
	}
	.btn-reset:disabled { opacity: 0.4; cursor: not-allowed; }

	.btn-save {
		flex: 1.2;
		padding: 0.6rem 0.5rem;
		border-radius: 8px;
		border: none;
		background: #758a6b;
		color: #fff;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		cursor: pointer;
		transition: all 0.18s;
		font-family: inherit;
		white-space: nowrap;
	}
	.btn-save:hover:not(:disabled) { background: #8fa483; }
	.btn-save.is-saving { background: #444; cursor: not-allowed; }
	.btn-save.is-saved { background: #3a7a3a; }
	.btn-save:disabled { opacity: 0.45; cursor: not-allowed; }

	/* Botón login */
	.btn-primary {
		width: 100%;
		padding: 0.9rem;
		border: none;
		border-radius: 50px;
		background: #758a6b;
		color: #fff;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		cursor: pointer;
		transition: background 0.2s;
		font-family: inherit;
	}
	.btn-primary:hover { background: #8fa483; }

	/* ── Saved URL info ──────────────────────── */
	.saved-url-info {
		font-size: 0.7rem;
		color: #666;
	}
	.saved-url-info summary {
		cursor: pointer;
		color: #555;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.saved-url {
		margin: 0.3rem 0 0;
		color: #555;
		word-break: break-all;
		font-size: 0.68rem;
		background: #1a1a1a;
		border-radius: 4px;
		padding: 0.3rem 0.5rem;
	}

</style>

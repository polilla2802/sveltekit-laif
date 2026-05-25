<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { categoryData as staticData } from '$utils/categoryData';

	const ADMIN_PASSWORD = 'laif2024';

	// Auth state
	let authenticated = false;
	let passwordInput = '';
	let authError = '';

	// Dashboard state
	let activeVisitors = 0;
	let unsubscribePresence: (() => void) | null = null;

	// Video URL management
	type VideoEntry = {
		key: string;
		title: string;
		icon: string;
		bgColor: string;
		mainVideoSrc: string;
		altVideoSrc: string;
		uploading: boolean;
		saving: boolean;
		saved: boolean;
		uploadProgress: number;
	};

	let videoEntries: VideoEntry[] = Object.entries(staticData).map(([key, val]) => ({
		key,
		title: val.title,
		icon: val.icon,
		bgColor: val.bgColor,
		mainVideoSrc: val.mainVideoSrc,
		altVideoSrc: val.altVideoSrc,
		uploading: false,
		saving: false,
		saved: false,
		uploadProgress: 0
	}));

	function login() {
		if (passwordInput === ADMIN_PASSWORD) {
			authenticated = true;
			authError = '';
			initDashboard();
		} else {
			authError = 'Contraseña incorrecta';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') login();
	}

	async function initDashboard() {
		try {
			const { db } = await import('$lib/firebase/firebase.client');
			const { collection, onSnapshot, getDocs, Timestamp } = await import('firebase/firestore');

			// Load current video URLs from Firestore
			const snap = await getDocs(collection(db, 'videoUrls'));
			snap.forEach((docSnap) => {
				const data = docSnap.data() as { mainVideoSrc: string; altVideoSrc: string };
				videoEntries = videoEntries.map((e) =>
					e.key === docSnap.id
						? { ...e, mainVideoSrc: data.mainVideoSrc || e.mainVideoSrc, altVideoSrc: data.altVideoSrc || e.altVideoSrc }
						: e
				);
			});

			// Subscribe to live visitor count
			unsubscribePresence = onSnapshot(collection(db, 'presence'), (snapshot) => {
				const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
				activeVisitors = snapshot.docs.filter((d) => {
					const ts = d.data().timestamp as ReturnType<typeof Timestamp.now> | null;
					return ts && ts.toMillis() > twoMinutesAgo;
				}).length;
			});
		} catch (err) {
			console.error('Error conectando a Firestore:', err);
		}
	}

	async function saveVideoUrl(entry: VideoEntry) {
		const idx = videoEntries.findIndex((e) => e.key === entry.key);
		videoEntries[idx] = { ...videoEntries[idx], saving: true, saved: false };

		try {
			const { db } = await import('$lib/firebase/firebase.client');
			const { doc, setDoc } = await import('firebase/firestore');
			await setDoc(doc(db, 'videoUrls', entry.key), {
				mainVideoSrc: entry.mainVideoSrc,
				altVideoSrc: entry.altVideoSrc
			});
			videoEntries[idx] = { ...videoEntries[idx], saving: false, saved: true };
			setTimeout(() => {
				videoEntries[idx] = { ...videoEntries[idx], saved: false };
			}, 2000);
		} catch (err) {
			console.error('Error guardando URL:', err);
			videoEntries[idx] = { ...videoEntries[idx], saving: false };
		}
	}

	async function handleFileUpload(entry: VideoEntry, event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const idx = videoEntries.findIndex((e) => e.key === entry.key);
		videoEntries[idx] = { ...videoEntries[idx], uploading: true, uploadProgress: 0 };

		try {
			const { storage } = await import('$lib/firebase/firebase.client');
			const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');

			const storagePath = `videos/${entry.key}${file.name.substring(file.name.lastIndexOf('.'))}`;
			const storageRef = ref(storage, storagePath);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					videoEntries[idx] = { ...videoEntries[idx], uploadProgress: Math.round(progress) };
				},
				(error) => {
					console.error('Error subiendo archivo:', error);
					videoEntries[idx] = { ...videoEntries[idx], uploading: false };
				},
				async () => {
					const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
					videoEntries[idx] = {
						...videoEntries[idx],
						mainVideoSrc: downloadUrl,
						altVideoSrc: downloadUrl,
						uploading: false,
						uploadProgress: 0
					};
					// Auto-save after upload
					await saveVideoUrl(videoEntries[idx]);
				}
			);
		} catch (err) {
			console.error('Error iniciando upload:', err);
			videoEntries[idx] = { ...videoEntries[idx], uploading: false };
		}
	}

	onDestroy(() => {
		unsubscribePresence?.();
	});
</script>

{#if !authenticated}
	<div class="login-screen">
		<div class="login-card">
			<img src="/logos/laif-logo.png" alt="Laif" class="login-logo" />
			<h1>Panel de Administración</h1>
			<div class="input-group">
				<input
					type="password"
					placeholder="Contraseña"
					bind:value={passwordInput}
					on:keydown={handleKeydown}
					autocomplete="current-password"
				/>
				{#if authError}
					<p class="error">{authError}</p>
				{/if}
			</div>
			<button class="btn-login" on:click={login}>Entrar</button>
		</div>
	</div>
{:else}
	<div class="admin-shell">
		<header class="admin-header">
			<img src="/logos/laif-logo.png" alt="Laif" class="header-logo" />
			<h1>Panel de Administración</h1>
			<div class="visitors-badge">
				<span class="dot"></span>
				<span class="visitors-count">{activeVisitors}</span>
				<span class="visitors-label">visitantes activos</span>
			</div>
		</header>

		<div class="admin-content">
			<h2 class="section-title">Gestión de Videos por Segmento</h2>
			<p class="section-hint">
				Ingresa una URL de video (Firebase Storage, YouTube, Twitch) o sube un archivo directamente.
				Los cambios se reflejan en la app inmediatamente.
			</p>

			<div class="video-grid">
				{#each videoEntries as entry (entry.key)}
					<div class="video-card" style="border-top: 4px solid {entry.bgColor}">
						<div class="card-header">
							<img src={entry.icon} alt={entry.title} class="segment-icon" />
							<h3>{entry.title}</h3>
						</div>

						<div class="field-group">
							<label for="main-{entry.key}">URL principal del video</label>
							<input
								id="main-{entry.key}"
								type="text"
								placeholder="https://..."
								bind:value={entry.mainVideoSrc}
							/>
						</div>

						<div class="field-group">
							<label for="alt-{entry.key}">URL alternativa</label>
							<input
								id="alt-{entry.key}"
								type="text"
								placeholder="https://..."
								bind:value={entry.altVideoSrc}
							/>
						</div>

						<div class="card-actions">
							<label class="btn-upload" class:disabled={entry.uploading}>
								{#if entry.uploading}
									Subiendo {entry.uploadProgress}%
								{:else}
									Subir archivo
								{/if}
								<input
									type="file"
									accept="video/*"
									style="display:none"
									on:change={(e) => handleFileUpload(entry, e)}
									disabled={entry.uploading}
								/>
							</label>

							<button
								class="btn-save"
								class:saving={entry.saving}
								class:saved={entry.saved}
								on:click={() => saveVideoUrl(entry)}
								disabled={entry.saving || entry.uploading}
							>
								{#if entry.saving}
									Guardando…
								{:else if entry.saved}
									¡Guardado!
								{:else}
									Guardar
								{/if}
							</button>
						</div>

						{#if entry.uploading}
							<div class="progress-bar">
								<div class="progress-fill" style="width: {entry.uploadProgress}%"></div>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<p class="firestore-note">
				Nota: Asegúrate de tener Firestore habilitado en tu proyecto de Firebase y las reglas de
				seguridad configuradas para permitir lectura y escritura.
			</p>
		</div>
	</div>
{/if}

<style>
	/* Login */
	.login-screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0f0f0f;
		padding: 1rem;
	}
	.login-card {
		background: #1c1c1c;
		border-radius: 20px;
		padding: 2.5rem 2rem;
		max-width: 380px;
		width: 100%;
		text-align: center;
		border: 1px solid #333;
	}
	.login-logo {
		width: 80px;
		margin: 0 auto 1.5rem;
		display: block;
	}
	.login-card h1 {
		color: white;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin: 0 0 1.5rem;
	}
	.input-group {
		margin-bottom: 1.25rem;
	}
	.input-group input {
		width: 100%;
		padding: 0.85rem 1rem;
		border-radius: 10px;
		border: 1px solid #444;
		background: #2a2a2a;
		color: white;
		font-size: 1rem;
		outline: none;
		transition: border 0.2s;
	}
	.input-group input:focus {
		border-color: #758a6b;
	}
	.error {
		color: #ff6b6b;
		font-size: 0.8rem;
		margin: 0.5rem 0 0;
		text-align: left;
	}
	.btn-login {
		width: 100%;
		padding: 0.9rem;
		border-radius: 50px;
		border: none;
		background: #758a6b;
		color: white;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		cursor: pointer;
		transition: background 0.25s;
		font-family: inherit;
	}
	.btn-login:hover {
		background: #8fa483;
	}

	/* Admin shell */
	.admin-shell {
		min-height: 100vh;
		background: #0f0f0f;
		color: white;
	}
	.admin-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 2rem;
		background: #1c1c1c;
		border-bottom: 1px solid #333;
		flex-wrap: wrap;
	}
	.header-logo {
		width: 40px;
	}
	.admin-header h1 {
		color: white;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin: 0;
		flex: 1;
	}
	.visitors-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #2a2a2a;
		border: 1px solid #444;
		border-radius: 50px;
		padding: 0.4rem 1rem;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #4caf50;
		animation: pulse 2s ease infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}
	.visitors-count {
		font-size: 1.1rem;
		font-weight: bold;
		color: #4caf50;
	}
	.visitors-label {
		font-size: 0.75rem;
		color: #aaa;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Content */
	.admin-content {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}
	.section-title {
		color: white;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin: 0 0 0.5rem;
	}
	.section-hint {
		color: #888;
		font-size: 0.8rem;
		margin: 0 0 2rem;
	}

	/* Video grid */
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.25rem;
		margin-bottom: 2rem;
	}
	.video-card {
		background: #1c1c1c;
		border-radius: 12px;
		padding: 1.25rem;
		border: 1px solid #333;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.segment-icon {
		width: 36px;
		height: 36px;
		object-fit: contain;
		border-radius: 6px;
	}
	.card-header h3 {
		color: white;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0;
	}
	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.field-group label {
		font-size: 0.7rem;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	.field-group input {
		padding: 0.6rem 0.75rem;
		border-radius: 8px;
		border: 1px solid #444;
		background: #2a2a2a;
		color: white;
		font-size: 0.8rem;
		outline: none;
		transition: border 0.2s;
		width: 100%;
	}
	.field-group input:focus {
		border-color: #758a6b;
	}
	.card-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}
	.btn-upload {
		flex: 1;
		padding: 0.65rem;
		border-radius: 8px;
		border: 1px dashed #555;
		background: transparent;
		color: #aaa;
		font-size: 0.75rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
		text-transform: uppercase;
		letter-spacing: 1px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.btn-upload:hover:not(.disabled) {
		border-color: #758a6b;
		color: #8fa483;
	}
	.btn-upload.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.btn-save {
		flex: 1;
		padding: 0.65rem;
		border-radius: 8px;
		border: none;
		background: #758a6b;
		color: white;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}
	.btn-save:hover:not(:disabled) {
		background: #8fa483;
	}
	.btn-save.saving {
		background: #555;
		cursor: not-allowed;
	}
	.btn-save.saved {
		background: #4caf50;
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.progress-bar {
		height: 4px;
		background: #333;
		border-radius: 4px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: #758a6b;
		transition: width 0.3s;
		border-radius: 4px;
	}
	.firestore-note {
		color: #666;
		font-size: 0.72rem;
		border: 1px solid #333;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		line-height: 1.6;
		margin: 0;
	}
</style>

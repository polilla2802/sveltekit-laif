<script lang="ts">
	import { onMount } from 'svelte';

	let visible = false;

	onMount(() => {
		if (!localStorage.getItem('laif-privacy-accepted')) {
			visible = true;
		}
	});

	function accept() {
		localStorage.setItem('laif-privacy-accepted', '1');
		visible = false;
	}
</script>

{#if visible}
	<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
		<div class="modal">
			<img src="/logos/laif-logo.png" alt="Laif" class="logo" />
			<h2 id="privacy-title">Aviso de Privacidad</h2>
			<div class="content">
				<p>
					En <strong>LAIF</strong> nos comprometemos a proteger tu privacidad y el tratamiento
					responsable de tus datos personales conforme a la Ley Federal de Protección de Datos
					Personales en Posesión de los Particulares (LFPDPPP).
				</p>
				<p>
					Los datos que podemos recopilar durante tu visita (como dirección IP y comportamiento de
					navegación) son utilizados exclusivamente para mejorar tu experiencia en nuestra
					plataforma y generar estadísticas de uso anónimas.
				</p>
				<p>
					No compartimos tu información personal con terceros sin tu consentimiento previo, salvo
					obligación legal. Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación u
					Oposición) contactándonos en:
					<strong>privacidad@laif.mx</strong>
				</p>
				<p>
					Al hacer clic en <em>"Acepto y continuar"</em> confirmas haber leído y aceptado este
					aviso de privacidad.
				</p>
			</div>
			<button on:click={accept}>Acepto y continuar</button>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.88);
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.modal {
		background: #1c1c1c;
		border-radius: 20px;
		padding: 2rem 2rem 1.5rem;
		max-width: 480px;
		width: 100%;
		text-align: center;
		border: 1px solid #323119;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
	}
	.logo {
		width: 72px;
		margin: 0 auto 1.25rem;
		display: block;
	}
	h2 {
		color: white;
		font-size: 1.1rem;
		margin: 0 0 1.25rem;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	.content {
		text-align: left;
		max-height: 220px;
		overflow-y: auto;
		margin-bottom: 1.5rem;
		padding-right: 4px;
	}
	.content::-webkit-scrollbar {
		width: 4px;
	}
	.content::-webkit-scrollbar-thumb {
		background: #444;
		border-radius: 4px;
	}
	.content p {
		color: #bbb;
		font-size: 0.75rem;
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}
	.content strong {
		color: #e0e0e0;
	}
	.content em {
		color: #e0e0e0;
	}
	button {
		background: #758a6b;
		color: white;
		border: none;
		padding: 0.85rem 2rem;
		border-radius: 50px;
		font-size: 0.85rem;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		transition: background 0.25s;
		width: 100%;
		font-family: inherit;
	}
	button:hover {
		background: #8fa483;
	}
</style>

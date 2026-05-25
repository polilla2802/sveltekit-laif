<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/navigation/header/Header.svelte';
	import PrivacyPopup from '$lib/components/PrivacyPopup.svelte';
	import '$lib/styles/app.css';

	onMount(() => {
		function setViewportHeight() {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		setViewportHeight();
		window.addEventListener('resize', setViewportHeight);

		// Visitor presence tracking
		const sessionId = Math.random().toString(36).slice(2);
		let heartbeat: ReturnType<typeof setInterval>;

		function ping() {
			fetch('/api/presence', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, path: window.location.pathname })
			}).catch(() => {});
		}

		function leave() {
			fetch('/api/presence', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId }),
				keepalive: true
			}).catch(() => {});
		}

		ping();
		heartbeat = setInterval(ping, 30000);
		window.addEventListener('beforeunload', leave);

		return () => {
			window.removeEventListener('resize', setViewportHeight);
			window.removeEventListener('beforeunload', leave);
			clearInterval(heartbeat);
		};
	});
</script>

<PrivacyPopup />
<Header />

<main class="text-white bg-primaryGreen layout">
	<section class="flex-1 h-full mx-auto flex-container">
		<div class="h-full">
			<slot />
		</div>
	</section>
</main>

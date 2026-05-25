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

		// Visitor presence tracking for live stats
		let presenceId: string | null = null;
		let heartbeatInterval: ReturnType<typeof setInterval>;

		async function registerPresence() {
			try {
				const { db } = await import('$lib/firebase/firebase.client');
				const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
				presenceId = Math.random().toString(36).slice(2);
				const presenceRef = doc(db, 'presence', presenceId);
				await setDoc(presenceRef, {
					timestamp: serverTimestamp(),
					path: window.location.pathname
				});
				heartbeatInterval = setInterval(async () => {
					if (presenceId) {
						await setDoc(presenceRef, {
							timestamp: serverTimestamp(),
							path: window.location.pathname
						});
					}
				}, 30000);
			} catch {
				// Firestore no disponible
			}
		}

		async function removePresence() {
			if (!presenceId) return;
			try {
				const { db } = await import('$lib/firebase/firebase.client');
				const { doc, deleteDoc } = await import('firebase/firestore');
				await deleteDoc(doc(db, 'presence', presenceId));
			} catch {
				// ignore
			}
		}

		registerPresence();
		window.addEventListener('beforeunload', removePresence);

		return () => {
			window.removeEventListener('resize', setViewportHeight);
			window.removeEventListener('beforeunload', removePresence);
			clearInterval(heartbeatInterval);
			removePresence();
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

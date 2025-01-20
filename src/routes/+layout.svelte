<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/navigation/header/Header.svelte';
	import '$lib/styles/app.css';

	let actualViewportHeight: string = '100vh';

	onMount(() => {
		// Set custom height variable based on viewport height
		function setViewportHeight() {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}

		// Set the viewport height initially
		setViewportHeight();

		// Update the viewport height when the window is resized (to account for toolbars)
		window.addEventListener('resize', setViewportHeight);

		// Clean up event listener on component destroy
		return () => {
			window.removeEventListener('resize', setViewportHeight);
		};
	});
</script>

<Header />

<main class="text-white bg-primaryGreen layout">
	<section class="flex-1 h-full mx-auto flex-container">
		<div class="h-full">
			<slot />
		</div>
	</section>
</main>

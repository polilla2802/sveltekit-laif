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

<main class="text-white layout bg-primaryGreen full-height-section">
	<section class="container flex-1 h-full px-4 mx-auto flex-container">
		<div class="h-full slot-content">
			<slot />
		</div>
	</section>
</main>

<style>
	/* Use the custom --vh variable for mobile-specific viewport height */
	.full-height-section {
		height: calc(var(--vh, 1vh) * 90); /* 100% of the calculated viewport height */
	}

	/* Fallback to regular 100vh for non-affected devices */
	@media (min-width: 1024px) {
		.full-height-section {
			height: 90vh;
		}
	}

	@media only screen and (max-width: 600px) {
	}
</style>

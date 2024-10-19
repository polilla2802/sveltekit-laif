<script lang="ts">
	import { onMount } from 'svelte';

	export let opened = false;

	let actualViewportHeight: string = '90vh';

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

<section
	style={`bottom: ${opened ? '0' : `calc(-90 * var(--vh))`};`}
	class="flex items-center justify-between h-full py-10 align-middle videos-container"
></section>

<style>
	@import '$lib/components/layouts/videos/styles/VideosContainerStyles.css';
</style>

<script lang="ts">
	import LaifLabel from '$lib/components/layouts/laif/container/label/LaifLabel.svelte';
	import LaifContainer from '$lib/components/layouts/laif/container/LaifContainer.svelte';
	import { categoryData } from '$utils/categoryData';
	import { onMount } from 'svelte';

	export let currentCategory: keyof typeof categoryData = 'laif';

	function setCategory(category: keyof typeof categoryData) {
		currentCategory = category;
	}

	// Update anchorValue from the URL hash
	function updateAnchor() {
		const hash = window.location.hash.slice(1); // Remove the '#' prefix
		currentCategory = hash || 'laif'; // Default to 'laif' if no hash
	}
	// Initialize and track hash changes
	onMount(() => {
		updateAnchor(); // Check the initial hash

		// Listen for hash changes
		window.addEventListener('hashchange', updateAnchor);

		// Cleanup event listener on destroy
		return () => {
			window.removeEventListener('hashchange', updateAnchor);
		};
	});
</script>

<section class="flex flex-col justify-between h-full px-5 py-5 bg-primaryGreen full-height-section">
	<div class="mt-5 md:mt-10">
		<LaifContainer {categoryData} {currentCategory} {setCategory} />
	</div>
	<LaifLabel {categoryData} {currentCategory}></LaifLabel>
</section>

<style>
	@import '$lib/styles/routes/stream/StreamStyles.css';
</style>

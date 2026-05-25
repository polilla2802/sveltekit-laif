<script lang="ts">
	import LaifLabel from '$lib/components/layouts/laif/container/label/LaifLabel.svelte';
	import LaifContainer from '$lib/components/layouts/laif/container/LaifContainer.svelte';
	import { categoryData as staticData } from '$utils/categoryData';
	import { onMount } from 'svelte';

	type CategoryData = typeof staticData;

	let categoryData: CategoryData = { ...staticData };
	export let currentCategory: keyof CategoryData = 'laif';

	function setCategory(category: keyof CategoryData) {
		currentCategory = category;
	}

	function updateAnchor() {
		const hash = window.location.hash.slice(1);
		currentCategory = ((hash as keyof CategoryData) || 'laif') as keyof CategoryData;
	}

	async function loadVideoUrls() {
		try {
			const res = await fetch('/api/video-urls');
			if (!res.ok) return;
			const overrides: Record<string, { mainVideoSrc: string; altVideoSrc: string }> =
				await res.json();
			categoryData = Object.fromEntries(
				Object.entries(staticData).map(([key, value]) => [
					key,
					overrides[key] ? { ...value, ...overrides[key] } : value
				])
			) as CategoryData;
		} catch {
			// Red no disponible — se usan los valores por defecto
		}
	}

	onMount(() => {
		updateAnchor();
		window.addEventListener('hashchange', updateAnchor);
		loadVideoUrls();

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

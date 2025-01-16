<script lang="ts">
	import VideoContainer from '$lib/components/layouts/videos/tile/VideoTile.svelte';
	import { categoryData } from '$utils/categoryData';

	// Get all categories except "laif"
	const categoryEntries = Object.entries(categoryData).filter(([key]) => key !== 'laif');
</script>

<section class="grid h-full grid-cols-4 grid-rows-2 full-height-section">
	{#each categoryEntries as [key, { title, bgColor, videoSrc, label, icon }]}
		<VideoContainer {title} {bgColor} {videoSrc} {icon} />
	{/each}
</section>

<style>
	@import '$lib/styles/routes/videos/VideoStyles.css';
</style>

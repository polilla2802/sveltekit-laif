<script lang="ts">
	export let opened = false;
</script>

<section
	style={opened ? 'bottom:0;' : 'bottom:-90vh;'}
	class="flex items-center justify-between h-full py-10 align-middle videos-container"
></section>

<style>
	@import '$lib/components/layouts/videos/styles/VideosContainerStyles.css';
</style>

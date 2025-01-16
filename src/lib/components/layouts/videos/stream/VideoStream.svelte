<script lang="ts">
	export let videoSrc: string;
	export let bgColor: string;
</script>

<section class="flex flex-col items-center justify-between h-full align-middle video-container">
	<div class="video-bg" style="background-color: {bgColor};">
		<video src={videoSrc} autoplay loop muted playsinline controls>
			<track kind="captions" />
		</video>
	</div>
</section>

<style>
	@import '$lib/components/layouts/videos/stream/styles/VideoStreamStyles.css';
</style>

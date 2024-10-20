<script lang="ts">
	export let title: string;
	export let videoSrc: string;
	export let bgColor: string;
</script>

<section class="flex flex-col items-center justify-between h-full align-middle video-container">
	<div class="video-bg">
		<div class="overlay" style="background-color: {bgColor};"></div>
		<video
			src={videoSrc}
			autoplay
			loop
			muted
			playsinline
		>
			<track kind="captions" />
		</video>
	</div>
	<div class="video-title">
		<h2 class="uppercase">{title}</h2>
	</div>
</section>

<style>
	@import '$lib/components/layouts/videos/styles/VideoContainerStyles.css';
</style>

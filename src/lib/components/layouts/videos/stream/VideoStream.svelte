<script lang="ts">
	import { isYouTubeUrl, toYouTubeEmbedUrl, isTwitchUrl, toTwitchEmbedUrl } from '$utils/videoSource';
	import { browser } from '$app/environment';

	export let videoSrc: string;
	export let bgColor: string;

	$: youtubeEmbed = isYouTubeUrl(videoSrc) ? toYouTubeEmbedUrl(videoSrc) : null;
	$: twitchEmbed = browser && isTwitchUrl(videoSrc)
		? toTwitchEmbedUrl(videoSrc, window.location.hostname)
		: null;
</script>

<section class="flex flex-col items-center justify-between h-full align-middle video-container">
	<div class="video-bg" style="background-color: {bgColor};">
		{#if youtubeEmbed}
			<iframe
				src={youtubeEmbed}
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		{:else if twitchEmbed}
			<iframe
				src={twitchEmbed}
				title="Twitch live stream"
				frameborder="0"
				allow="autoplay"
				allowfullscreen
			></iframe>
		{:else}
			<video src={videoSrc} autoplay loop muted playsinline controls>
				<track kind="captions" />
			</video>
		{/if}
	</div>
</section>

<style>
	@import '$lib/components/layouts/videos/stream/styles/VideoStreamStyles.css';
</style>

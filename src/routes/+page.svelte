<script lang="ts">
	import VideosContainer from '$lib/components/layouts/videos/VideosContainer.svelte';
	import { takeMeToVideos } from '$utils/routing';
	import Icon from '@iconify/svelte';

	let videoOpened = false;

	let touchStartY = 0;
	let touchEndY = 0;

	// Function to handle touch start
	function handleTouchStart(event: TouchEvent) {
		touchStartY = event.touches[0].clientY;
	}

	// Function to handle touch end and detect swipe up
	function handleTouchEnd(event: TouchEvent) {
		touchEndY = event.changedTouches[0].clientY;
		// Detecting swipe up (start Y > end Y)
		if (touchStartY - touchEndY > 50) {
			// Trigger navigation to the /videos page
			videoOpened = true;
		}
	}

	// Function to open VideosContainer
	function openVideos() {
		console.log('opened');
		videoOpened = true;
	}
</script>

<section class="flex flex-col items-center justify-between h-full py-10 align-middle">
	<div class="space-y-24"></div>
	<img class="hidden md:block bg-web" src="/images/bg-web.png" alt="bg-web" />
	<img class="block bg-mobile md:hidden" src="/images/bg-mobile.png" alt="bg-web" />
	<img src="/logos/laif-logo.png" alt="laif logo" />
	<button
		class="points-container"
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
		on:click={openVideos}
	>
		<Icon
			class="grow-shrink-big"
			width="32"
			height="42"
			icon="material-symbols-light:circle"
			style="color: white"
		/>
		<Icon
			class="grow-shrink-mid"
			width="22"
			height="32"
			icon="stash:circle-dot-duotone"
			style="color: white"
		/>
		<Icon
			class="grow-shrink-small"
			width="12"
			height="22"
			icon="stash:circle-duotone"
			style="color: white"
		/>
	</button>
</section>

<VideosContainer opened={videoOpened} />

<style>
	@import '$lib/styles/routes/home/HomeStyles.css';
</style>

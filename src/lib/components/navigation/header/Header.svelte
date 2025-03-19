<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { takeMeHome } from '$utils/routing';
	import { slideRightAnimation } from '$utils/slideRightAnimation';

	let isOpen: boolean = false;

	let hash = '';

	function toggleMenu() {
		hash = window.location.hash.slice(1); // Remove the '#' prefix
		isOpen = !isOpen;
	}

	// Swipe detection logic
	let touchStartX = 0;
	let touchEndX = 0;
	const SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent) {
		touchEndX = event.changedTouches[0].clientX;
		checkForSwipe();
	}

	function checkForSwipe() {
		const swipeDistance = touchStartX - touchEndX;
		// If swipe distance is greater than the threshold and it's a left swipe
		if (swipeDistance > SWIPE_THRESHOLD && isOpen) {
			isOpen = false; // Close the menu
		}
	}

	let loading = true;

	onMount(() => {
		loading = false;

		// Client-side code only
		if (typeof window !== 'undefined') {
			hash = window.location.hash.slice(1); // Remove the '#' prefix
		}
	});
</script>

{#if loading}
	<div class="py-16"></div>
{:else}
	<section class={$page.url.pathname === '/' ? 'bg-primaryGreen' : 'bg-black'}>
		<nav class="container flex justify-between px-10 mx-auto md:container md:px-6 top-nav">
			<div class={$page.url.pathname === '/' ? 'hidden' : 'z-10 w-24 logo-container'}>
				<button on:click={takeMeHome}>
					<img src="/logos/laif-logo.png" alt="menu button" />
				</button>
			</div>
			<div class="space-x-24"></div>

			<button class="z-10 text-white menu-toggle" on:click={toggleMenu}>
				<div class="icon-container">
					<img src="/images/menu.png" alt="menu button" />
				</div>
			</button>

			{#if isOpen}
				<nav
					class="side-nav"
					transition:slideRightAnimation={{ duration: 350 }}
					on:touchstart={handleTouchStart}
					on:touchend={handleTouchEnd}
				>
					<ul class="items-start justify-between">
						<div class="flex flex-col item-list">
							<a
								class:active={$page.url.pathname === '/'}
								class="smooth-underline"
								href="/"
								on:click={toggleMenu}>Inicio</a
							>
							<a
								class:active={hash == 'bienes'}
								class="smooth-underline"
								href="/stream#bienes"
								on:click={toggleMenu}>Bienes y Raices</a
							>
							<a
								class:active={hash == 'vida'}
								class="smooth-underline"
								href="/stream#vida"
								on:click={toggleMenu}>Estilo de Vida</a
							>
							<a
								class:active={hash == 'industria'}
								class="smooth-underline"
								href="/stream#industria"
								on:click={toggleMenu}>Industria</a
							>
							<a
								class:active={hash == 'destinos'}
								class="smooth-underline"
								href="/stream#destinos"
								on:click={toggleMenu}>Destinos</a
							>
							<a
								class:active={hash == 'explora'}
								class="smooth-underline"
								href="/stream#explora"
								on:click={toggleMenu}>Explora</a
							>

							<a
								class:active={hash == 'cultura'}
								class="smooth-underline"
								href="/stream#cultura"
								on:click={toggleMenu}>Cultura y Arte</a
							>
							<a
								class:active={hash == 'naturaleza'}
								class="smooth-underline"
								href="/stream#naturaleza"
								on:click={toggleMenu}>Naturaleza</a
							>
							<a
								class:active={hash == 'historia'}
								class="smooth-underline"
								href="/stream#historia"
								on:click={toggleMenu}>Historia</a
							>
						</div>
					</ul>
				</nav>
			{/if}
		</nav>
	</section>
{/if}

<style>
	@import '$lib/components/navigation/header/styles/HeaderStyles.css';
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import { takeMeHome } from '$utils/routing';
	import { slideRightAnimation } from '$utils/slideRightAnimation';

	let isOpen: boolean = false;

	function toggleMenu() {
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
</script>

<section class="md:hidden">
	<button class="text-white menu-toggle" on:click={toggleMenu}>
		<div class="icon-container">
			<img src="/images/menu.png" alt="menu button" />
		</div>
	</button>

	{#if isOpen}
		<nav
			transition:slideRightAnimation={{ duration: 350 }}
			on:touchstart={handleTouchStart}
			on:touchend={handleTouchEnd}
		>
			<ul class="items-start justify-between">
				<div class="flex flex-col park-list">
					<div class="flex justify-between gap-2 mt-3 mb-5 mr-0">
						<div><p>Parque</p></div>
						<div>
							<button on:click={() => takeMeHome()}
								><p class:active-lan={$page.url.pathname.includes('/es')}>Es</p></button
							>
						</div>
						<div><p>Código</p></div>
					</div>
					<a
						class:active={$page.url.pathname === '/explora'}
						class="smooth-underline"
						href="/explora">Explora</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/mapas')}
						class="smooth-underline"
						href="/es/mapas">Bienes y Raices</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/folletos')}
						class="smooth-underline"
						href="/es/folletos">Estilo de Vida</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/videos')}
						class="smooth-underline"
						href="/es/videos">Historia</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/servicios')}
						class="smooth-underline"
						href="/es/servicios">Industria</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/servicios')}
						class="smooth-underline"
						href="/es/servicios">Naturaleza</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/servicios')}
						class="smooth-underline"
						href="/es/servicios">Entretenimiento</a
					>
					<a
						class:active={$page.url.pathname.includes('/es/servicios')}
						class="smooth-underline"
						href="/es/servicios">Destinos</a
					>
				</div>
			</ul>
		</nav>
	{/if}
</section>

<style>
	@import '$lib/components/navigation/mobile-menu/styles/MobileMenuStyles.css';
</style>

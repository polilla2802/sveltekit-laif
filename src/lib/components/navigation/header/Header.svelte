<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { takeMeHome } from '$utils/routing';
	import MobileMenu from '../mobile-menu/MobileMenu.svelte';

	let loading = true;

	onMount(() => {
		loading = false;
	});
</script>

{#if loading}
	<nav class="py-16"></nav>
{:else}
	<section class={$page.url.pathname === '/' ? 'bg-primaryGreen' : 'bg-black'}>
		<MobileMenu />

		<nav class="flex justify-between mx-auto md:container md:px-6">
			<div class="z-10 w-24 logo-container"></div>
			<div class="z-10 hidden left md:block">
				<div class="flex flex-col left-container md:flex-row">
					
				</div>
			</div>

			<button class="hidden text-whit md:block menu-toggle">
				<div class="icon-container">
					<img src="/images/menu.png" alt="menu button" />
				</div>
			</button>
		</nav>
	</section>
{/if}

<style>
	@import '$lib/components/navigation/header/styles/HeaderStyles.css';
</style>

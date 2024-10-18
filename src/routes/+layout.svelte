<script lang="ts">
	import Header from '$lib/components/navigation/header/Header.svelte';
	import '$lib/styles/app.css';
</script>

<Header />

<main class="text-white layout bg-primaryGreen">
	<section class="container flex-1 h-full px-4 mx-auto flex-container">
		<div class="h-full slot-content">
			<slot />
		</div>
	</section>
</main>

<style>
	main {
		min-height: 90vh;
	}

	main section {
		min-height: 90vh;
	}

	main section div {
		min-height: 90vh;
	}

	@media only screen and (max-width: 600px) {
		main {
			min-height: 80vh;
		}

		main section {
			min-height: 80vh;
		}

		main section div {
			min-height: 80vh;
		}
	}
</style>

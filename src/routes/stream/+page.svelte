<script lang="ts">
	import LaifContainer from '$lib/components/layouts/laif/LaifContainer.svelte';
	import { onMount } from 'svelte';

	export let currentCategory: keyof typeof categoryData = 'laif';

	function setCategory(category: keyof typeof categoryData) {
		currentCategory = category;
	}

	const categoryData: Record<string, { bgColor: string; videoSrc: string }> = {
		laif: {
			bgColor: '#323119',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'
		},
		bienes: {
			bgColor: '#E35836',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'
		},
		vida: {
			bgColor: '#9AA9E6',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Festilo%20de%20vida.mp4?alt=media&token=17fa0fc2-5c53-4d45-9363-db4882358942#t=0.1'
		},
		industria: {
			bgColor: '#F5D579',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Findustria.mp4?alt=media&token=401d2157-cb2b-4ddb-acc5-0f0eb74d5065#t=0.1'
		},
		destinos: {
			bgColor: '#476C87',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fnaturaleza.mp4?alt=media&token=36282d62-27fb-4998-94c2-3304524b3422#t=0.1'
		},
		explora: {
			bgColor: '#B4ACCC',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fexplora.mp4?alt=media&token=ad4023c0-6642-496e-b61b-a2314b1cf959#t=0.1'
		},
		entretenimiento: {
			bgColor: '#FB9285',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fentretenimiento.mp4?alt=media&token=65181897-0b36-41af-8ddb-14d203982513#t=0.1'
		},
		naturaleza: {
			bgColor: '#5A774F',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fnaturaleza.mp4?alt=media&token=36282d62-27fb-4998-94c2-3304524b3422#t=0.1'
		},
		historia: {
			bgColor: '#515A80',
			videoSrc:
				'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fhistoria.mp4?alt=media&token=8b334ff4-04ba-4069-8829-16756acdc127#t=0.1'
		}
	};

	// Update anchorValue from the URL hash
	function updateAnchor() {
		const hash = window.location.hash.slice(1); // Remove the '#' prefix
		currentCategory = hash || 'laif'; // Default to 'laif' if no hash
	}
	// Initialize and track hash changes
	onMount(() => {
		updateAnchor(); // Check the initial hash

		// Listen for hash changes
		window.addEventListener('hashchange', updateAnchor);

		// Cleanup event listener on destroy
		return () => {
			window.removeEventListener('hashchange', updateAnchor);
		};
	});
</script>

<section class="h-full px-5 py-5 bg-primaryGreen full-height-section">
	<LaifContainer {categoryData} {currentCategory} {setCategory} />
</section>

<style>
	@import '$lib/styles/routes/stream/StreamStyles.css';
</style>

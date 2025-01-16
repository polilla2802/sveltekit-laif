<script lang="ts">
	import VideoStream from '$lib/components/layouts/videos/stream/VideoStream.svelte';
	import { onMount } from 'svelte';

	export let anchorValue: string;

	let laif = true;
	let bienes = false;
	let vida = false;
	let industria = false;
	let destinos = false;
	let explora = false;
	let entretenimiento = false;
	let naturaleza = false;
	let historia = false;

	function resetFlags() {
		laif =
			bienes =
			vida =
			industria =
			destinos =
			explora =
			entretenimiento =
			naturaleza =
			historia =
				false;
	}

	// Update flags based on anchorValue
	function checkCategoryByAnchor() {
		resetFlags();
		switch (anchorValue) {
			case 'bienes':
				bienes = true;
				break;
			case 'vida':
				vida = true;
				break;
			case 'industria':
				industria = true;
				break;
			case 'destinos':
				destinos = true;
				break;
			case 'explora':
				explora = true;
				break;
			case 'entretenimiento':
				entretenimiento = true;
				break;
			case 'naturaleza':
				naturaleza = true;
				break;
			case 'historia':
				historia = true;
				break;
			default:
				laif = true;
				break;
		}
	}

	function toogleLaif() {
		resetFlags();
		laif = true;
	}

	function toogleBienes() {
		resetFlags();
		bienes = true;
	}

	function toogleVida() {
		resetFlags();
		vida = true;
	}

	function toogleIndustria() {
		resetFlags();
		industria = true;
	}

	function toogleDestinos() {
		resetFlags();
		destinos = true;
	}

	function toogleExplora() {
		resetFlags();
		explora = true;
	}

	function toogleEntretenimiento() {
		resetFlags();
		entretenimiento = true;
	}

	function toogleNaturaleza() {
		resetFlags();
		naturaleza = true;
	}

	function toogleHistoria() {
		resetFlags();
		historia = true;
	}

	// Update anchorValue from the URL hash
	function updateAnchor() {
		anchorValue = window.location.hash.slice(1); // Remove the '#' prefix
		checkCategoryByAnchor();
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
	<div class="laif-container">
		<div class="laif-content">
			<div class="gap-1 px-3 md:px-12 md:gap-3 top-nav">
				<button
					class="flex-1 {bienes ? 'active' : ''}"
					on:click={toogleBienes}
					style="background-color:#E35836"
				>
					<a href="#bienes" class="small-font">Bienes y Raices</a>
					<img src="/icons/icon-bienes.png" alt="menu button" />
				</button>
				<button
					class="flex-1 {vida ? 'active' : ''}"
					on:click={toogleVida}
					style="background-color:#9AA9E6"
				>
					<a href="#vida" class="small-font">Estilo de Vida</a>
					<img src="/icons/icon-vida.png" alt="menu button" />
				</button>
				<button
					class="flex-1 {industria ? 'active' : ''}"
					on:click={toogleIndustria}
					style="background-color:#F5D579"
				>
					<a href="#industria">Industria</a>
					<img src="/icons/icon-industria.png" alt="menu button" />
				</button>
				<button
					class="flex-1 {destinos ? 'active' : ''}"
					on:click={toogleDestinos}
					style="background-color:#476C87"
				>
					<a href="#destinos">Destinos</a>
					<img src="/icons/icon-destinos.png" alt="menu button" />
				</button>
			</div>
			<div class="laif-stream">
				{#if laif}
					<VideoStream
						bgColor={'red'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'}
					/>
				{:else if bienes}
					<VideoStream
						bgColor={'#E35836'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'}
					/>
				{:else if vida}
					<VideoStream
						bgColor={'#9AA9E6'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Festilo%20de%20vida.mp4?alt=media&token=17fa0fc2-5c53-4d45-9363-db4882358942#t=0.1'}
					/>
				{:else if industria}
					<VideoStream
						bgColor={'#F5D579'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Findustria.mp4?alt=media&token=401d2157-cb2b-4ddb-acc5-0f0eb74d5065#t=0.1'}
					/>
				{:else if destinos}
					<VideoStream
						bgColor={'#476C87'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fnaturaleza.mp4?alt=media&token=36282d62-27fb-4998-94c2-3304524b3422#t=0.1'}
					/>
				{:else if explora}
					<VideoStream
						bgColor={'#B4ACCC'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fexplora.mp4?alt=media&token=ad4023c0-6642-496e-b61b-a2314b1cf959#t=0.1'}
					/>
				{:else if entretenimiento}
					<VideoStream
						bgColor={'#FB9285'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fentretenimiento.mp4?alt=media&token=65181897-0b36-41af-8ddb-14d203982513#t=0.1'}
					/>
				{:else if naturaleza}
					<VideoStream
						bgColor={'#5A774F'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fnaturaleza.mp4?alt=media&token=36282d62-27fb-4998-94c2-3304524b3422#t=0.1'}
					/>
				{:else if historia}
					<VideoStream
						bgColor={'#515A80'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fhistoria.mp4?alt=media&token=8b334ff4-04ba-4069-8829-16756acdc127#t=0.1'}
					/>
				{:else}
					<VideoStream
						bgColor={'red'}
						videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'}
					/>
				{/if}
			</div>
			<div class="gap-1 px-3 md:px-12 md:gap-3 bottom-nav">
				<button
					class="flex-1 {explora ? 'active' : ''}"
					on:click={toogleExplora}
					style="background-color:#B4ACCC"
				>
					<a href="#explora">Explora</a>
					<img src="/icons/icon-explora.png" alt="menu button" />
				</button>
				<button
					class="flex-1 {entretenimiento ? 'active' : ''}"
					on:click={toogleEntretenimiento}
					style="background-color:#FB9285"
				>
					<a href="#entretenimiento" class="small-font">Entretenimiento</a>
					<img src="/icons/icon-entretenimiento.png" alt="menu button" />
				</button>
				<button
					class="flex-1 {naturaleza ? 'active' : ''}"
					on:click={toogleNaturaleza}
					style="background-color:#5A774F"
				>
					<a href="#naturaleza">Naturaleza</a>
					<img src="/icons/icon-naturaleza.png" alt="menu button" />
				</button>
				<button
					class="flex-1 {historia ? 'active' : ''}"
					on:click={toogleHistoria}
					style="background-color:#515A80"
				>
					<a href="#historia">Historia</a>
					<img src="/icons/icon-historia.png" alt="menu button" />
				</button>
			</div>
		</div>
	</div>

	<div class="disc-container">
		<button on:click={toogleLaif}>
			<img src="/images/vinyl.png" alt="vinyl" />
		</button>
	</div>
</section>

<style>
	@import '$lib/styles/routes/stream/StreamStyles.css';
</style>

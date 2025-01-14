<script lang="ts">
	import VideoStream from '../videos/stream/VideoStream.svelte';

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
</script>

<div class="laif-container">
	<div class="laif-content">
		<div class="gap-1 px-3 md:px-12 md:gap-3 top-nav">
			<button class="flex-1" on:click={toogleBienes}>
				<a href="#bienes" style="background-color:#E35836">Bienes y Raices</a>
			</button>
			<button class="flex-1" on:click={toogleVida}>
				<a href="#vida" style="background-color:#9AA9E6">Estilo de Vida</a>
			</button>
			<button class="flex-1" on:click={toogleIndustria}>
				<a href="#industia" style="background-color:#F5D579">Industria</a>
			</button>
			<button class="flex-1" on:click={toogleDestinos}>
				<a href="#destinos" style="background-color:#476C87">Destinos</a>
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
			<button class="flex-1" on:click={toogleExplora}>
				<a href="#explora" style="background-color:#B4ACCC">Explora</a>
			</button>
			<button class="flex-1" on:click={toogleEntretenimiento}>
				<a href="#entretenimiento" style="background-color:#FB9285">Entretenimiento</a>
			</button>
			<button class="flex-1" on:click={toogleNaturaleza}>
				<a href="#naturaleza" style="background-color:#5A774F">Naturaleza</a>
			</button>
			<button class="flex-1" on:click={toogleHistoria}>
				<a href="#historia" style="background-color:#515A80">Historia</a>
			</button>
		</div>
	</div>
</div>

<style>
	@import '$lib/components/layouts/laifstream/styles/LaifStreamStyles.css';
</style>

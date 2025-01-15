<script lang="ts">
	import VideoContainer from '$lib/components/layouts/videos/tile/VideoTile.svelte';
</script>

<section class="grid h-full grid-cols-4 grid-rows-2 full-height-section">
	<VideoContainer
		title={'Bienes y Raices'}
		bgColor={'#E35836'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'}
	/>

	<VideoContainer
		title={'Estilo de Vida'}
		bgColor={'#9AA9E6'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Festilo%20de%20vida.mp4?alt=media&token=17fa0fc2-5c53-4d45-9363-db4882358942#t=0.1'}
	/>
	<VideoContainer
		title={'Industria'}
		bgColor={'#F5D579'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Findustria.mp4?alt=media&token=401d2157-cb2b-4ddb-acc5-0f0eb74d5065#t=0.1'}
	/>
	<VideoContainer
		title={'Destinos'}
		bgColor={'#476C87'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fnaturaleza.mp4?alt=media&token=36282d62-27fb-4998-94c2-3304524b3422#t=0.1'}
	/>
	<VideoContainer
		title={'Explora'}
		bgColor={'#B4ACCC'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fexplora.mp4?alt=media&token=ad4023c0-6642-496e-b61b-a2314b1cf959#t=0.1'}
	/>
	<VideoContainer
		title={'Entretenimiento'}
		bgColor={'#FB9285'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fentretenimiento.mp4?alt=media&token=65181897-0b36-41af-8ddb-14d203982513#t=0.1'}
	/>
	<VideoContainer
		title={'Naturaleza'}
		bgColor={'#5A774F'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fnaturaleza.mp4?alt=media&token=36282d62-27fb-4998-94c2-3304524b3422#t=0.1'}
	/>
	<VideoContainer
		title={'Historia'}
		bgColor={'#515A80'}
		videoSrc={'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fhistoria.mp4?alt=media&token=8b334ff4-04ba-4069-8829-16756acdc127#t=0.1'}
	/>
</section>

<style>
	@import '$lib/styles/routes/videos/VideoStyles.css';
</style>

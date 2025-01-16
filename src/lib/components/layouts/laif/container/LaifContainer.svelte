<script lang="ts">
	import VideoStream from '../../videos/stream/VideoStream.svelte';
	export let categoryData: Record<string, { bgColor: string; videoSrc: string; icon: string }>;
	export let currentCategory: keyof typeof categoryData;
	export let setCategory: (category: keyof typeof categoryData) => void;
</script>

<div>
	<div class="laif-container">
		<div class="laif-content">
			<div class="gap-1 px-3 md:px-12 md:gap-3 top-nav">
				<a
					href="#bienes"
					class="flex-1 {currentCategory === 'bienes' ? 'active' : ''}"
					on:click={() => setCategory('bienes')}
					style="background-color:#E35836"
				>
					<p class="small-font">Bienes y Raices</p>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
				</a>
				<a
					href="#vida"
					class="flex-1 {currentCategory === 'vida' ? 'active' : ''}"
					on:click={() => setCategory('vida')}
					style="background-color:#9AA9E6"
				>
					<p class="small-font">Estilo de Vida</p>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
				</a>
				<a
					href="#industria"
					class="flex-1 {currentCategory === 'industria' ? 'active' : ''}"
					on:click={() => setCategory('industria')}
					style="background-color:#F5D579"
				>
					<p>Industria</p>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
				</a>
				<a
					href="#destinos"
					class="flex-1 {currentCategory === 'destinos' ? 'active' : ''}"
					on:click={() => setCategory('destinos')}
					style="background-color:#476C87"
				>
					<p>Destinos</p>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
				</a>
			</div>
			<div class="laif-stream">
				<VideoStream
					bgColor={categoryData[currentCategory]?.bgColor || 'black'}
					videoSrc={categoryData[currentCategory]?.videoSrc ||
						'https://firebasestorage.googleapis.com/v0/b/laif-dev-4dd99.appspot.com/o/videos%2Fbienesyraices.mp4?alt=media&token=3111b0bc-dbd7-408a-a336-63b7fc700d26#t=0.1'}
				/>
			</div>
			<div class="gap-1 px-3 md:px-12 md:gap-3 bottom-nav">
				<a
					href="#explora"
					class="flex-1 {currentCategory === 'explora' ? 'active' : ''}"
					on:click={() => setCategory('explora')}
					style="background-color:#B4ACCC"
				>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
					<p>Explora</p>
				</a>
				<a
					href="#entretenimiento"
					class="flex-1 {currentCategory === 'entretenimiento' ? 'active' : ''}"
					on:click={() => setCategory('entretenimiento')}
					style="background-color:#FB9285"
				>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
					<p class="small-font">Entretenimiento</p>
				</a>
				<a
					href="#naturaleza"
					class="flex-1 {currentCategory === 'naturaleza' ? 'active' : ''}"
					on:click={() => setCategory('naturaleza')}
					style="background-color:#5A774F"
				>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
					<p>Naturaleza</p>
				</a>
				<a
					href="#historia"
					class="flex-1 {currentCategory === 'historia' ? 'active' : ''}"
					on:click={() => setCategory('historia')}
					style="background-color:#515A80"
				>
					<img src={categoryData[currentCategory]?.icon || ''} alt="menu button" />
					<p>Historia</p>
				</a>
			</div>
		</div>
	</div>

	<div class="px-5 py-5 mt-5 disc-container">
		<a href="#laif" on:click={() => setCategory('laif')}>
			<img src="/images/vinyl.png" alt="vinyl" />
		</a>
	</div>
</div>

<style>
	@import '$lib/components/layouts/laif/container/styles/LaifContainerStyles.css';
</style>

<script lang="ts">
	export let title: string;
	export let altVideoSrc: string;
	export let bgColor: string;
	export let icon: string;

	let anchor: string;

	switch (title) {
		case 'Explora':
			anchor = '#explora';
			break;
		case 'Bienes y Raices':
			anchor = '#bienes';
			break;
		case 'Estilo de Vida':
			anchor = '#vida';
			break;
		case 'Industria':
			anchor = '#industria';
			break;
		case 'Destinos':
			anchor = '#destinos';
			break;
		case 'Entretenimiento':
			anchor = '#entretenimiento';
			break;
		case 'Naturaleza':
			anchor = '#naturaleza';
			break;
		case 'Historia':
			anchor = '#historia';
			break;
		default:
			anchor = '';
			break;
	}

	const href = `/stream/${anchor}`;
</script>

<section class="flex flex-col items-center justify-between h-full align-middle video-container">
	<a {href}>
		<div class="video-bg">
			<div class="overlay" style="background-color: black"></div>
			<video src={altVideoSrc} autoplay loop muted playsinline>
				<track kind="captions" />
			</video>
		</div>
		<div class="video-title" style="background-color: {bgColor};">
			<h2 class="uppercase">{title}</h2>
			<img src={icon} alt="menu button" />
		</div>
	</a>
</section>

<style>
	@import '$lib/components/layouts/videos/tile/styles/VideoTileStyles.css';
</style>

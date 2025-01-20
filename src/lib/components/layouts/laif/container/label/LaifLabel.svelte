<script lang="ts">
	export let categoryData: Record<
		string,
		{ title: string; bgColor: string; mainVideoSrc: string; label: string; icon: string }
	>;
	export let currentCategory: keyof typeof categoryData;
</script>

<div class="bg-white label-container">
	<div class="label-content">
		<div
			class="img-container"
			style="background-color:{categoryData[currentCategory]?.bgColor || 'black'}"
		>
			<img src={categoryData[currentCategory]?.icon || '/logos/laif-logo.png'} alt="menu button" />
		</div>
		<div class="bg-white">
			<p class="small-font">{categoryData[currentCategory]?.label || 'Label'}</p>
		</div>
	</div>
</div>

<style>
	@import '$lib/components/layouts/laif/container/label/styles/LaifLabelStyles.css';
</style>

<script lang="ts" setup>
// import * as livephotoskit from 'livephotoskit';
// const { augmentElementAsPlayer } = livephotoskit;

defineProps<{
	src: string;
	alt: string;
}>();
// const livePhotoRef = useTemplateRef<HTMLDivElement>('livePhotoRef');

// watch(
// 	() => getPreviewVisible(),
// 	(visible) => {
// 		if (!visible) return;

// 		nextTick(() => {
// 			const el = livePhotoRef.value;
// 			if (!el) return;

// 			augmentElementAsPlayer(el, {
// 				photoSrc: getPreviewSrc(),
// 				videoSrc: getIsLive(),
// 			});

// 			document.querySelector('.lpk-badge')?.addEventListener('click', (e) => e.stopImmediatePropagation(), true);
// 		});
// 	},
// );
</script>

<template>
	<img
		:src
		:alt
		loading="lazy"
		decoding="async"
		class="z-2 h-full max-h-screen w-full max-w-[100vw] object-contain"
	/>
</template>

<style lang="postcss" scoped></style>

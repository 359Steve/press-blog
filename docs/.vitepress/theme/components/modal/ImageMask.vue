<script lang="ts" setup>
import * as livephotoskit from 'livephotoskit';

const { src, alt, live } = defineProps<{
	src: string;
	alt: string;
	live?: Photo['live'];
}>();

const { augmentElementAsPlayer } = livephotoskit;
const livePhotoRef = useTemplateRef<HTMLDivElement>('livePhotoRef');
const btn = ref<Element | null>(null);

function handleClick(e: Event) {
	e.stopImmediatePropagation();
}

watchEffect(() => {
	nextTick(() => {
		if (!live) return;
		const el = livePhotoRef.value;
		if (!el) return;

		augmentElementAsPlayer(el, {
			photoSrc: src,
			videoSrc: live?.url,
		});

		const badge = document.querySelector('.lpk-badge');
		if (!badge) return;

		badge.removeEventListener('click', handleClick, true);
		badge.addEventListener('click', handleClick, true);

		btn.value = badge;
	});
});

onBeforeUnmount(() => {
	btn.value?.removeEventListener('click', handleClick, true);
});
</script>

<template>
	<div v-if="live" ref="livePhotoRef" class="h-full w-full" />
	<img
		v-else
		:src
		:alt
		loading="lazy"
		decoding="async"
		class="z-2 h-full max-h-screen w-full max-w-[100vw] object-contain"
	/>
</template>

<style lang="postcss" scoped></style>

<script lang="ts" setup>
const { images } = defineProps<{
	images: {
		src: string;
		alt: string;
	}[];
}>();

const css = computed(() => {
	return images && images.length > 1;
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

onMounted(() => {
	if (!containerRef.value) return;

	useEventListener(
		containerRef,
		'wheel',
		(event: WheelEvent) => {
			event.preventDefault();
			containerRef.value!.scrollLeft += event.deltaY;
		},
		{ passive: false },
	);
});
</script>

<template>
	<div ref="containerRef" :class="[css ? 'mt-4 box-border flex h-100 gap-4 overflow-x-auto py-3' : 'w-full']">
		<img
			v-for="({ src, alt }, index) in images"
			:key="index"
			v-preview="{
				src,
				alt,
			}"
			class="cursor-pointer object-cover"
			:class="[css ? 'h-full' : 'w-full']"
			:src="src"
			:alt="alt"
		/>
	</div>
</template>

<style lang="postcss" scoped></style>

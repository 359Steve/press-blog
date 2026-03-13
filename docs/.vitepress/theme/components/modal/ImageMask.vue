<script lang="ts" setup>
defineProps<{
	src: string;
	alt: string;
}>();
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

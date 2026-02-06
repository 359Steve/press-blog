<script lang="ts" setup>
const { images } = defineProps<{
	images: {
		src: string;
		alt: string;
		is_live: boolean;
	}[];
}>();

const css = computed(() => {
	return images && images.length > 1;
});
</script>

<template>
	<div
		:class="[
			css
				? '-mx-(--prose-margin) mt-4 box-border flex h-100 gap-4 overflow-x-auto px-(--prose-margin) py-3'
				: 'w-full',
		]"
	>
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

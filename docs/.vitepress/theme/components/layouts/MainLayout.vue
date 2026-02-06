<script lang="ts" setup>
const route = useRoute();

const notMd = computed(() => route.data.title === '404' || route.path === '/');
</script>

<template>
	<main class="relative box-border flex! min-h-screen flex-col">
		<slot name="header" />
		<div
			class="vp-doc m-auto w-full max-w-(--prose-width) flex-1 px-6 py-2"
			:class="notMd && 'flex items-center justify-center'"
		>
			<slot />
		</div>
		<slot name="footer" />
	</main>
</template>

<style lang="scss" scoped></style>

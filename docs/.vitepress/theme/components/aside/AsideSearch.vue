<script lang="ts" setup>
const { open } = useModals();
</script>

<template>
	<div
		class="glass w-full rounded-lg border border-black/5 p-3 shadow-md transition-all duration-200 dark:border-white/8"
	>
		<button
			type="button"
			class="text-blog-tertiary! h-full w-full text-left text-base"
			aria-label="搜索"
			@click="open('SearchMask')"
		>
			<span class="vpi-search" aria-hidden="true" />
			<span class="text">搜索</span>
		</button>
	</div>
</template>

<style lang="postcss" scoped>
.input-p {
	@apply bg-white text-base;
}
</style>

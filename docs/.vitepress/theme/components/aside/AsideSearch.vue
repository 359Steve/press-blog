<script lang="ts" setup>
const { open } = useModals();
</script>

<template>
	<div class="glass w-full rounded-lg p-3 shadow-[0_0_20px_var(--color-blog-shadow)]">
		<button
			type="button"
			class="text-blog-tertiary! h-full w-full text-left text-base"
			aria-label="搜索"
			data-v-dc969bf6=""
			data-v-76d3335c=""
			@click="open('SearchMask')"
		>
			<span class="vpi-search" aria-hidden="true" data-v-76d3335c="" />
			<span class="text" data-v-76d3335c="">搜索</span>
		</button>
	</div>
</template>

<style lang="postcss" scoped>
.input-p {
	@apply bg-white text-base;
}
</style>

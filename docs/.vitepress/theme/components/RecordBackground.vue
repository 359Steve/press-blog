<script lang="ts" setup>
const { showRadialGradient = true } = defineProps<{
	showRadialGradient?: boolean;
}>();
</script>

<template>
	<div class="transition-bg fixed inset-0 z-[-1] h-dvh w-full bg-zinc-50 dark:bg-zinc-900">
		<div class="absolute inset-0 overflow-hidden">
			<div class="aurora-bg" :class="[showRadialGradient ? 'mask-bg' : '']" />
		</div>
		<slot />
	</div>
</template>

<style lang="scss" scoped></style>

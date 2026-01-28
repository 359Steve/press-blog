<script lang="ts" setup>
const { className = '', showRadialGradient = true } = defineProps<{
	className?: string;
	showRadialGradient?: boolean;
}>();
</script>

<template>
	<div v-bind="$attrs" class="transition-bg bg-zinc-50 dark:bg-zinc-900" :class="[className]">
		<div class="absolute inset-0 overflow-hidden">
			<div class="pointer-events-none absolute -inset-2.5 opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] [background-image:var(--white-gradient),var(--aurora)] bg-position-[50%_50%,50%_50%] bg-size-[300%,200%] after:absolute after:inset-0 after:animate-aurora after:mix-blend-difference after:content-[''] after:bg-fixed after:[background-image:var(--white-gradient),var(--aurora)] after:bg-size-[200%,100%] dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]"
				:class="[
					showRadialGradient ? 'mask-[radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_90%)]' : '',
				]" />
		</div>
		<slot />
	</div>
</template>

<style lang="scss" scoped></style>

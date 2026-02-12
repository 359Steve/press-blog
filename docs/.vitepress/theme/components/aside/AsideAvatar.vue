<script lang="ts" setup>
const { logo, logoLink } = defineProps<{
	logo: string;
	logoLink: string;
}>();

defineEmits<{
	(e: 'toPath', value: string): void;
}>();

const { isDark } = useData();

const toggleAppearance = inject<(e: MouseEvent) => Promise<void>>('toggle-appearance');

const changeTheme = (e: MouseEvent) => toggleAppearance?.(e);
</script>

<template>
	<div class="relative flex h-fit w-full items-center justify-center overflow-hidden px-8 py-4">
		<img
			:src="logo"
			class="aspect-square w-full cursor-pointer rounded-full object-cover shadow-[6px_2px_20px_var(--color-blog-shadow)]"
			@click="$emit('toPath', logoLink)"
		/>
		<div class="absolute top-0 left-0 z-10 cursor-pointer" @click="changeTheme">
			<Icon :icon="isDark ? 'ri:moon-clear-fill' : 'ri:sun-fill'" width="22" />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>

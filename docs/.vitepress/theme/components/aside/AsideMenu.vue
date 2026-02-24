<script lang="ts" setup>
import type { NavItemWithIcon } from '@/theme/types/vitepress-types';

const { menuList } = defineProps<{
	menuList: NavItemWithIcon[];
}>();
defineEmits<{
	(e: 'toPath', value: string): void;
}>();
const route = useRoute();

function isActive(item: NavItemWithIcon): boolean {
	if (!item.activeMatch) {
		return false;
	}
	return new RegExp(item.activeMatch).test(route.path);
}
</script>

<template>
	<div class="w-full">
		<ul class="flex w-full flex-wrap items-center justify-center gap-4">
			<li
				v-for="item in menuList"
				:key="item.link"
				class="flex h-full w-full items-center justify-center gap-4 px-0 text-center text-base leading-10 hover:cursor-pointer"
				:class="[
					isActive(item)
						? 'bg-blog-accent rounded-lg text-white shadow-[0_0_10px_var(--color-blog-accent)]'
						: 'text-blog-tertiary bg-inherit',
				]"
				@click="$emit('toPath', item.link)"
			>
				<Icon :icon="item.icon" width="18" />
				<span>{{ item.text }}</span>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped></style>

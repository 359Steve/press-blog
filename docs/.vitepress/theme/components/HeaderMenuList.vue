<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useData, useRoute, useRouter } from 'vitepress';
import { ref } from 'vue';
import { useJojoHeader } from '../store/jojoHeader';

const router = useRouter();
const route = useRoute();
const { drawer } = storeToRefs(useJojoHeader());
const { theme } = useData<{
	nav: ThemeVavbarItem[];
}>();
const menuList = ref(theme.value.nav);

function isActive(item: ThemeVavbarItem): boolean {
	if (!item.activeMatch) {
		return false;
	}
	return new RegExp(item.activeMatch).test(route.path);
}

async function toPath(item: (typeof menuList.value)[number]) {
	router.go(item.link);
}
</script>

<template>
	<div class="w-fit">
		<ul class="w-fit items-center justify-center sm:flex sm:gap-x-12">
			<li
				v-for="item in menuList"
				:key="item.link"
				class="rounded-base mb-4 px-4 text-[20px] leading-12 shadow-sm hover:cursor-pointer sm:mb-0 sm:h-full sm:rounded-none sm:px-0 sm:shadow-none"
				:class="[!isActive(item) && 'hover:text-black']"
				@click="toPath(item)"
			>
				<span :class="[isActive(item) && 'text-blog-primary font-bold']">
					{{ item.text }}
				</span>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped></style>

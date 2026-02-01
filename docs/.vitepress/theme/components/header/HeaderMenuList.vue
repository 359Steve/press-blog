<script lang="ts" setup>
const router = useRouter();
const route = useRoute();
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
				class="text-bg h-full px-0 text-[20px] leading-12 hover:cursor-pointer"
				:class="[!isActive(item) && 'hover:text-blog-primary']"
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

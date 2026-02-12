<script lang="ts" setup>
import type { NavItemWithIcon, SocialWithColor } from '@/theme/types/vitepress-types';

const router = useRouter();
const useHeader = useJojoHeader();
const { showSidebar } = storeToRefs(useHeader);
const { setShowSidebar } = useHeader;
const { theme } = useData<{
	logo: string;
	logoLink: string;
	nav: NavItemWithIcon[];
	socialLinks: SocialWithColor[];
}>();

// 页面跳转
function toPath(path: string): void {
	router.go(path);
}
</script>

<template>
	<div v-if="showSidebar" class="fixed inset-0 z-40 bg-black/40 lg:hidden" @click="setShowSidebar(false)" />
	<aside
		class="bg-bg-blog-primary fixed inset-y-0 left-0 z-50 h-full w-60 transform p-4 shadow-lg transition-transform lg:static lg:w-52 lg:translate-x-0 lg:bg-inherit lg:p-0 lg:shadow-none"
		:class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
	>
		<div class="sticky top-6 flex flex-wrap justify-center gap-6">
			<AsideAvatar :logo="theme.logo" :logo-link="theme.logoLink" @to-path="toPath" />

			<AsideCount />

			<AsideMenu :menu-list="theme.nav" @to-path="toPath" />

			<AsideSearch />

			<AsideSocialize :social-links="theme.socialLinks" />
		</div>
	</aside>
</template>

<style lang="scss" scoped></style>

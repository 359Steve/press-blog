<script lang="ts" setup>
const router = useRouter();
const { isDark } = useData();
const { setHeaderHeight, getScroll } = useJojoHeader();
const headerEl = useTemplateRef<HTMLHeadElement>('headerEl');
const menuIcons = ref<ThemeNavbarConfig[]>([
	{
		text: '首页',
		link: '/',
		icon: 'ri:ghost-smile-fill',
	},
	{
		text: '博客',
		link: '/blog',
		icon: 'mdi:bookmark-multiple',
	},
	{
		text: '日记',
		link: '/record',
		icon: 'ri:article-fill',
	},
	{
		text: '相册',
		link: '/photos',
		icon: 'ri:camera-3-fill',
	},
]);
const aLinks = ref<ThemeNavbarConfig[]>([
	{
		text: 'facebook',
		link: 'https://www.facebook.com/profile.php?id=61565513711985',
		icon: 'ri:facebook-circle-fill',
	},
	{
		text: 'github',
		link: 'https://github.com/359Steve',
		icon: 'ri:github-fill',
	},
]);

const toggleAppearance = inject<(e: MouseEvent) => Promise<void>>('toggle-appearance');

const changeTheme = (e: MouseEvent) => toggleAppearance?.(e);

onMounted(() => {
	nextTick(() => {
		const height: number = headerEl.value!.getBoundingClientRect().height;
		setHeaderHeight(height);
	});
});
</script>

<template>
	<header
		ref="headerEl"
		class="glass sticky top-0 z-10 flex h-15 w-full items-center justify-between border-x-0 px-4 transition-all duration-300 ease-in-out"
		:class="[getScroll() ? '-translate-y-full' : 'translate-y-0']"
	>
		<div class="h-full w-fit cursor-pointer py-4" @click="router.go('/')">
			<LogoBasicLogo />
		</div>
		<div class="absolute left-[50%] hidden h-full translate-x-[-50%] items-center justify-center sm:flex">
			<HeaderMenuList />
		</div>
		<div class="flex h-full w-fit items-center justify-between gap-x-2">
			<HeaderItem
				v-for="(item, index) in menuIcons"
				:key="item.icon"
				:class="[index < 3 && 'block sm:hidden']"
				@click="router.go(item.link!)"
			>
				<Icon :icon="item.icon" width="22" />
			</HeaderItem>
			<HeaderItem v-for="item in aLinks" :key="item.icon" class="hidden sm:flex">
				<a :href="item.link" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center">
					<Icon :icon="item.icon" width="22" />
				</a>
			</HeaderItem>
			<HeaderItem @click="changeTheme">
				<Icon :icon="isDark ? 'ri:moon-clear-fill' : 'ri:sun-fill'" width="22" />
			</HeaderItem>
		</div>
	</header>
</template>

<style lang="scss" scoped></style>

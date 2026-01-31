<script lang="ts" setup>
import { useRouter } from 'vitepress';
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { useJojoHeader } from '../store/jojoHeader';

const router = useRouter();
const { setHeaderHeight, getScroll } = useJojoHeader();
const headerEl = useTemplateRef<HTMLHeadElement>('headerEl');
const drawer = ref<boolean>(false);

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
		class="glass sticky top-0 z-10 flex h-12 w-full items-center justify-between border-x-0 px-4 transition-all duration-300 ease-in-out"
		:class="[getScroll() ? '-translate-y-full' : 'translate-y-0']"
	>
		<div class="h-full w-24 cursor-pointer py-2" @click="router.go('/')">
			<LogoBasicLogo />
		</div>
		<div class="absolute left-[50%] hidden h-full translate-x-[-50%] items-center justify-center sm:flex">
			<HeaderMenuList />
		</div>
		<div class="flex h-full w-fit items-center justify-between gap-x-2">
			<div
				class="text-blog-primary bg-bg-blog-primary flex h-10 w-10 items-center justify-center rounded-md p-2 shadow-md hover:cursor-pointer"
				@click="router.go('/photos')"
			>
				<a rel="noopener noreferrer">
					<Icon icon="ri:camera-3-fill" width="20" />
				</a>
			</div>
			<div
				class="text-blog-primary bg-bg-blog-primary hidden h-10 w-10 items-center justify-center rounded-md p-2 shadow-md hover:cursor-pointer sm:flex"
			>
				<a
					href="https://www.facebook.com/profile.php?id=61565513711985"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon icon="ri:facebook-circle-fill" width="20" />
				</a>
			</div>
			<div
				class="text-blog-primary bg-bg-blog-primary hidden h-10 w-10 items-center justify-center rounded-md p-2 shadow-md hover:cursor-pointer sm:flex"
			>
				<a href="https://github.com/359Steve" target="_blank" rel="noopener noreferrer">
					<Icon icon="ri:github-fill" width="20" />
				</a>
			</div>
			<div class="flex items-center justify-between gap-x-2">
				<div
					class="text-blog-primary bg-bg-blog-primary flex h-10 w-10 items-center justify-center rounded-md p-2 shadow-md hover:cursor-pointer"
				>
					<Icon icon="ri:sun-fill" width="20" />
				</div>
				<div
					class="text-blog-primary bg-bg-blog-primary flex h-10 w-10 items-center justify-center rounded-md p-2 shadow-md hover:cursor-pointer sm:hidden"
					@click="drawer = !drawer"
				>
					<Icon icon="ri:menu-fold-4-fill" width="20" />
				</div>
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped></style>

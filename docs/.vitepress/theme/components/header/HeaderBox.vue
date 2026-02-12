<script lang="ts" setup>
const useHeader = useJojoHeader();
const { setShowSidebar } = useHeader;
</script>

<template>
	<header
		class="bg-bg-blog-primary sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 shadow-[0_2px_5px_var(--color-blog-shadow)] lg:hidden"
	>
		<button class="px-3 py-2" @click="setShowSidebar(true)">
			<Icon icon="ri:menu-2-fill" width="24" />
		</button>
		<div class="box-border h-6 w-12">
			<LogoBasicLogo />
		</div>
	</header>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
const { theme } = useData<{
	footer: {
		copyright: string;
		message: string;
	};
}>();
const footerMessage = computed(() => theme.value.footer);
</script>

<template>
	<div class="mt-8 grid w-full grid-cols-1 gap-2 py-2 sm:grid-cols-2">
		<div class="col-span-1 flex items-center justify-center gap-2 sm:col-span-2">
			<span class="text-[1em]">{{ footerMessage.copyright }}</span>
			<a
				href="http://beian.miit.gov.cn/"
				target="_blank"
				rel="noopener noreferrer"
				class="mr-4 hidden items-center gap-2 text-[1em] sm:flex"
			>
				{{ footerMessage.message }}
			</a>
		</div>
		<div class="flex items-center justify-center sm:hidden">
			<a
				href="http://beian.miit.gov.cn/"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 text-[1em]"
			>
				{{ footerMessage.message }}
			</a>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>

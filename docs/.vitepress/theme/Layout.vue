<script lang="ts" setup>
import { Content } from 'vitepress';
import RecordBackground from './components/RecordBackground.vue';
</script>

<template>
	<div class="relative w-full">
		<ClientOnly>
			<RecordBackground class-name="w-full h-[100dvh] fixed inset-0 z-[-1]" />
		</ClientOnly>
		<div class="flex h-full min-h-screen w-full flex-col">
			<Content />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>

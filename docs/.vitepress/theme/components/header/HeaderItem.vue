<script lang="ts" setup></script>

<template>
	<div
		v-bind="$attrs"
		class="text-blog-primary flex h-10 w-10 items-center justify-center rounded-md p-2 hover:cursor-pointer"
	>
		<slot />
	</div>
</template>

<style lang="scss" scoped></style>

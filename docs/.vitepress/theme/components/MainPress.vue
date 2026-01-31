<script lang="ts" setup></script>

<template>
	<main class="box-border min-h-screen">
		<slot name="header" />
		<div class="vp-doc m-auto w-full max-w-(--prose-width) px-6 py-2">
			<slot />
		</div>
	</main>
</template>

<style lang="scss" scoped></style>

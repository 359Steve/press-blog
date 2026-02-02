<script lang="ts" setup></script>

<template>
	<main class="box-border flex! min-h-screen flex-col">
		<slot name="header" />
		<div class="vp-doc m-auto w-full max-w-(--prose-width) flex-1 px-6 py-2">
			<slot />
		</div>
		<slot name="footer" />
	</main>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
const { frontmatter } = useData();
</script>

<template>
	<div class="vp-doc mt-6 w-full">
		<Content />
		<div class="mt-4 h-80 w-full sm:h-96 lg:h-140">
			<MapContainer
				:lng="frontmatter.lng"
				:lat="frontmatter.lat"
				:title="frontmatter.title"
				:cover="frontmatter.cover"
			/>
		</div>
		<FooterBox />
	</div>
</template>

<style lang="scss" scoped></style>

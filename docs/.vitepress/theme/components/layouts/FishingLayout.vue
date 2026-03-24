<script lang="ts" setup>
const { frontmatter } = useData();
</script>

<template>
	<FishingDetailLayout v-if="frontmatter.index" />
	<FishingSearchLayout v-else />
</template>

<style lang="scss" scoped></style>

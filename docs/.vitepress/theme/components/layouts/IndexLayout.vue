<script lang="ts" setup>
const { frontmatter } = useData();
</script>

<template>
	<IndexListLayout v-if="frontmatter.index" />
	<IndexSearchLayout v-else />
</template>

<style lang="scss" scoped></style>

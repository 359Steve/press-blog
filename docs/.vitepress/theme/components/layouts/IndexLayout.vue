<script lang="ts" setup>
const { frontmatter } = useData();
</script>

<template>
	<IndexDetailLayout v-if="frontmatter.index" />
	<IndexSearchLayout v-else />
</template>

<style lang="scss" scoped></style>

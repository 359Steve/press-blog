<script lang="ts" setup>
const { frontmatter } = useData();
</script>

<template>
	<BlogListLayout v-if="frontmatter.blog" />
	<BlogSearchLayout v-else />
</template>

<style lang="scss" scoped></style>

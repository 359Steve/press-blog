<script lang="ts" setup>
import type { Component } from 'vue';
import BranchCanvas from 'branch-canvas';
import VPLoadingIndicator from 'vp-loading-indicator';
import AboutLayout from './components/layouts/AboutLayout.vue';
import BlogLayout from './components/layouts/BlogLayout.vue';
import IndexLayout from './components/layouts/IndexLayout.vue';
import PhotosLayout from './components/layouts/PhotosLayout.vue';
import RecordLayout from './components/layouts/RecordLayout.vue';

const { isDark, frontmatter } = useData();

const layouts: Record<string, Component> = {
    index: IndexLayout,
    blog: BlogLayout,
    record: RecordLayout,
    about: AboutLayout,
    photos: PhotosLayout,
};

function enableTransitions() {
    return 'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
}

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    if (!enableTransitions) {
        isDark.value = !isDark.value;
        return;
    }

    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    const transition = document.startViewTransition(() => {
        isDark.value = !isDark.value;
    });

    transition.ready.then(() => {
        document.documentElement.animate(
            {
                clipPath,
            },
            {
                duration: 500,
                easing: 'ease-in',
                fill: 'forwards',
                pseudoElement: '::view-transition-new(root)',
            },
        );
    });
});
</script>

<template>
    <ModalHost />

    <ClientOnly>
        <BranchCanvas />
        <VPLoadingIndicator color="var(--color-blog-accent)" />
    </ClientOnly>

    <MainLayout>
        <component :is="layouts[frontmatter.layout] || 'Content'" />
    </MainLayout>
</template>

<style lang="scss" scoped></style>

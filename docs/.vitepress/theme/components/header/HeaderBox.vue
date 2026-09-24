<script lang="ts" setup>
const { frontmatter } = useData();
const { showSidebar } = storeToRefs(useJojoHeader());
</script>

<template>
    <header
        class="bg-bg-blog-primary sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 shadow-[0_2px_5px_var(--color-blog-shadow)] lg:hidden"
    >
        <button class="px-3 py-2" @click="showSidebar = true">
            <Icon icon="ri:menu-2-fill" width="24" />
        </button>
        <Transition name="marquee" mode="out-in">
            <div :key="frontmatter.title" class="min-w-0 flex-1">
                <span class="block truncate text-sm">
                    {{ frontmatter.title }}
                </span>
            </div>
        </Transition>
        <div class="box-border h-6 w-12">
            <LogoBasicLogo />
        </div>
    </header>
</template>

<style lang="postcss" scoped></style>

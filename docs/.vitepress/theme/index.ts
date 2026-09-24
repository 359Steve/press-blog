import type { EnhanceAppContext, Theme } from 'vitepress';
import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { preview } from '@/theme/directives/preview';
import { unwrap } from '@/theme/directives/unwrap';
import DocTable from './components/DocTable.vue';
import Layout from './components/layouts/Layout.vue';
import ContentImage from './components/md/ContentImage.vue';
import 'vitepress/theme';
import '@/theme/css/style.css';

export default {
    /** 自定义站点布局 */
    Layout,
    /**
     * 增强 VitePress 应用：注册 Pinia、自定义指令与全局组件
     * @param ctx - VitePress 应用增强上下文
     */
    enhanceApp({ app }: EnhanceAppContext): void {
        app.use(createPinia());
        app.directive('unwrap', unwrap).directive('preview', preview);
        app.component('Icon', Icon).component('DocTable', DocTable).component('ContentImage', ContentImage);
    },
} satisfies Theme;

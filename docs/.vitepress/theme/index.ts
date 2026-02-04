import type { Theme } from 'vitepress';
import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import BlogList from './components/blog/BlogList.vue';
import BlogSearch from './components/blog/BlogSearch.vue';
import Layout from './Layout.vue';
import 'vitepress/theme';
import '@/theme/css/style.css';

export default {
	Layout,
	enhanceApp({ app }) {
		app.use(createPinia());
		app.component('Icon', Icon).component('BlogSearch', BlogSearch).component('BlogList', BlogList);
	},
} satisfies Theme;

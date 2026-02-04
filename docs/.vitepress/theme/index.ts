import type { Theme } from 'vitepress';
import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import DocTable from './components/DocTable.vue';
import Layout from './Layout.vue';
import 'vitepress/theme';
import '@/theme/css/style.css';

export default {
	Layout,
	enhanceApp({ app }) {
		app.use(createPinia());
		app.component('Icon', Icon).component('DocTable', DocTable);
	},
} satisfies Theme;

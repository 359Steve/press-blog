import type { Theme } from 'vitepress';
import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { preview } from '@/theme/directives/preview';
import { unwrap } from '@/theme/directives/unwrap';
import DocTable from './components/DocTable.vue';
import ContentImage from './components/md/ContentImage.vue';
import Layout from './Layout.vue';
import 'vitepress/theme';
import '@/theme/css/style.css';

export default {
	Layout,
	enhanceApp({ app }) {
		app.use(createPinia());
		app.directive('unwrap', unwrap).directive('preview', preview);
		app.component('Icon', Icon).component('DocTable', DocTable).component('ContentImage', ContentImage);
	},
} satisfies Theme;

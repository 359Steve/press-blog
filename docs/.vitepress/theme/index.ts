import type { Theme } from 'vitepress';
import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import BlogSearch from './components/blog/BlogSearch.vue';
import FooterBox from './components/footer/FooterBox.vue';
import HeaderBox from './components/header/HeaderBox.vue';
import HeaderItem from './components/header/HeaderItem.vue';
import HeaderMenuList from './components/header/HeaderMenuList.vue';
import LogoBasicLogo from './components/header/LogoBasicLogo.vue';
import MainPress from './components/MainPress.vue';
import NodetFound from './components/NotFound.vue';
import RecordBackground from './components/RecordBackground.vue';
import TRexRunner from './components/TRexRunner.vue';
import Layout from './Layout.vue';
import 'vitepress/theme';
import './style.css';

export default {
	Layout,
	enhanceApp({ app }) {
		app.use(createPinia());
		app.component('Icon', Icon)
			.component('RecordBackground', RecordBackground)
			.component('MainPress', MainPress)
			.component('NotFound', NodetFound)
			.component('TRexRunner', TRexRunner)
			.component('LogoBasicLogo', LogoBasicLogo)
			.component('HeaderBox', HeaderBox)
			.component('HeaderItem', HeaderItem)
			.component('HeaderMenuList', HeaderMenuList)
			.component('FooterBox', FooterBox)
			.component('BlogSearch', BlogSearch);
	},
} satisfies Theme;

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	lang: 'zh-CN',
	title: 'JoJo的个人博客',
	titleTemplate: ':title - JoJo',
	description: 'JoJo的个人博客，分享技术文章、生活记录和项目经验',
	head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

	cleanUrls: true,
	srcDir: 'src',

	vite: {
		plugins: [tailwindcss()],
	},

	themeConfig: {
		siteTitle: false,
		nav: [
			{ text: '首页', link: '/', activeMatch: '^/$' },
			{ text: '博客', link: '/blog', activeMatch: '^/blog(/|$)' },
			{ text: '日记', link: '/record', activeMatch: '^/record(/|$)' },
		] satisfies ThemeVavbarItem[],
	},
});

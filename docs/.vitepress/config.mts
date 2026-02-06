import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	lang: 'zh-CN',
	title: 'JoJo的个人博客',
	titleTemplate: ':title | JoJo',
	description: 'JoJo的个人博客，分享技术文章、生活记录和项目经验',

	base: '/',

	head: [
		['link', { rel: 'icon', href: '/favicon.ico' }],
		['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
		['meta', { name: 'theme-color', content: '#0f0f0f', media: '(prefers-color-scheme: dark)' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: 'JoJo的个人博客' }],
		['meta', { property: 'og:description', content: 'JoJo的个人博客，分享技术文章、生活记录和项目经验' }],
	],

	cleanUrls: true,
	srcDir: 'src',

	vite: {
		plugins: [
			AutoImport({
				imports: ['vitepress', 'vue', '@vueuse/core', 'pinia'],
				dirs: ['../.vitepress/theme/store'],
				dts: '../.vitepress/theme/types/auto-imports.d.ts',
			}),

			Components({
				dirs: ['../.vitepress/theme/components'],
				extensions: ['vue'],
				dts: '../.vitepress/theme/types/auto-components.d.ts',
			}),
			tailwindcss(),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, '../.vitepress'),
			},
		},
	},

	themeConfig: {
		siteTitle: false,
		i18nRouting: false,
		nav: [
			{ text: '首页', link: '/', activeMatch: '^/$' },
			{ text: '博客', link: '/blog', activeMatch: '^/blog(/|$)' },
			{ text: '日记', link: '/record', activeMatch: '^/record(/|$)' },
		],
		footer: {
			copyright: 'Copyright © 2025-present Joseph Joestar',
			message: '蜀ICP备2025171383号',
		},
	},

	markdown: {
		container: {
			detailsLabel: '点我查看代码',
		},
	},
});

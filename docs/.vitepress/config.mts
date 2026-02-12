import type MarkdownIt from 'markdown-it';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import attrs from 'markdown-it-attrs';
import container from 'markdown-it-container';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitepress';

function registerComponentContainer(md: MarkdownIt, name: string, component: string) {
	md.use(container, name, {
		render(tokens: any, idx: number) {
			const token = tokens[idx];
			if (name !== 'contentimage') {
				return token.nesting === 1 ? `<${component}>\n` : `</${component}>\n`;
			}

			if (token.nesting === 1) {
				let end = idx + 1;
				while (tokens[end].type !== `container_${name}_close`) end++;

				const inner = tokens.slice(idx + 1, end);

				const images: ImageType[] = [];

				inner.forEach((t: any) => {
					if (t.type === 'inline') {
						t.children?.forEach((child: any) => {
							if (child.type === 'image') {
								const attrs = Object.fromEntries(child.attrs || []);

								const is_live: string = child.attrGet('is_live') || 'false';
								const alt = child.children?.map((c: any) => c.content).join('') || '';

								images.push({
									...attrs,
									alt,
									is_live: JSON.parse(is_live.toLowerCase()),
								} as ImageType);
							}
						});
					}
				});

				return `<${component} :images='${JSON.stringify(images)}'>`;
			}

			return `</${component}>`;
		},
	});
}

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
		server: {
			port: 3000,
		},
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
			{ text: '回到首页', link: '/', activeMatch: '^/$', icon: 'ri:ghost-smile-fill' },
			{ text: '文章归档', link: '/blog', activeMatch: '^/blog(/|$)', icon: 'mdi:bookmark-multiple' },
			{ text: '心路历程', link: '/record', activeMatch: '^/record(/|$)', icon: 'ri:article-fill' },
			{ text: '珍藏回忆', link: '/photos', activeMatch: '^/photos(/|$)', icon: 'ri:camera-3-fill' },
			{ text: '关于博客', link: '/about', activeMatch: '^/about(/|$)', icon: 'ri:game-fill' },
		] as NavItemWithIcon[],

		outline: { level: [2, 4], label: '本页目录' },

		footer: {
			copyright: 'Copyright © 2025-present Joseph Joestar',
			message: '蜀ICP备2025171383号',
		},
	},

	markdown: {
		container: {
			detailsLabel: '点我查看代码',
		},
		image: {
			lazyLoading: true,
		},
		config(md) {
			md.use(attrs);
			registerComponentContainer(md, 'toclist', 'TocList');
			registerComponentContainer(md, 'doctable', 'DocTable');
			registerComponentContainer(md, 'contentimage', 'ContentImage');
		},
	},
});

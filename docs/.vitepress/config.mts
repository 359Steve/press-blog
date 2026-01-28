import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'JoJo的个人博客',
	description: 'JoJo的个人博客，分享技术文章、生活记录和项目经验',

	// Markdown 配置
	markdown: {
		theme: {
			light: 'github-light',
			dark: 'github-dark',
		},
		lineNumbers: true, // 显示行号
	},

	vite: {
		plugins: [tailwindcss()],
	},

	head: [
		['link', { rel: 'icon', href: '/favicon.ico' }],
	],
});

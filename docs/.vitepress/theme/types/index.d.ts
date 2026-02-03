/**
 * @description 菜单项类型
 */
interface ThemeVavbarItem {
	text: string;
	link: string;
	activeMatch?: string;
	[key: string]: any;
}

/**
 * @description 顶部导航菜单列表类型
 */
interface ThemeNavbarConfig extends ThemeVavbarItem {
	icon: string;
}

/**
 * @description 博客索引类型
 */
interface Post {
	title: string;
	cover: string;
	description: string;
	date: {
		time: number;
		string: string;
	};
	author: string;
	tags: {
		name: string;
		color: string;
		icon: string;
		url: string;
	}[];
	// 默认类型
	url: string | undefined;
	src: string | undefined;
	html: string | undefined;
	excerpt: string | undefined;
}

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

/**
 * @description 相册图片类型
 */
interface ImageType {
	src: string;
	alt: string;
	is_live: boolean;
	[key: string]: any;
}

/**
 * @description 提取组件props
 */
type PropsOf<T> = T extends new () => { $props: infer P } ? P : never;

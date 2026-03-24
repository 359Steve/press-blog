import type { ContentData } from 'vitepress';

/**
 * @description frontmatter 基础信息
 */
interface FrontmatterBase {
	title: string;
	cover: string;
	description: string;
	category: string[];
}

/**
 * @description 博客 frontmatter 类型
 */
interface PostFrontmatter extends FrontmatterBase {
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
}

/**
 * @description 钓点 frontmatter 类型
 */
interface FishingFrontmatter extends FrontmatterBase {
	id: string;
	province: string;
	city: string;
	lat: number;
	lng: number;
	type: string;
	night: boolean;
}

interface Content<T extends Record<string, any>> extends ContentData {
	frontmatter: T;
}

type Post = Content<PostFrontmatter>;
type Fishing = Content<FishingFrontmatter>;

/**
 * @description 文章归档类型
 */
interface GroupedPost {
	year: number;
	month: number;
	posts: Post[];
}

export type { Fishing, FishingFrontmatter, GroupedPost, Post, PostFrontmatter };

import type { ContentData } from 'vitepress';

/**
 * @description frontmatter 基础信息
 */
interface FrontmatterBase {
    /** 文章标题 */
    title: string;
    /** 封面图地址 */
    cover: string;
    /** 文章摘要 */
    description: string;
    /** 文章分类列表 */
    category: string[];
}

/**
 * @description 博客 frontmatter 类型
 */
export interface PostFrontmatter extends FrontmatterBase {
    /** 文章发布日期 */
    date: {
        /** 时间戳 */
        time: number;
        /** 格式化后的中文日期 */
        string: string;
    };
    /** 文章作者 */
    author: string;
    /** 文章标签列表 */
    tags: {
        /** 标签名称 */
        name: string;
        /** 标签颜色 */
        color: string;
        /** 标签图标 */
        icon: string;
        /** 标签跳转地址 */
        url: string;
    }[];
}

interface Content<T extends Record<string, any>> extends ContentData {
    /** 文章 frontmatter 数据 */
    frontmatter: T;
}

export type Post = Content<PostFrontmatter>;

/**
 * @description 文章归档类型
 */
export interface GroupedPost {
    /** 年份 */
    year: number;
    /** 月份，取值范围 1-12 */
    month: number;
    /** 该月份下的文章列表 */
    posts: Post[];
}

import type { Post, PostFrontmatter } from '../types/content-data';
import { createContentLoader } from 'vitepress';
import { transformDate } from '../utils';

declare const data: Post[];
export { data };

export default createContentLoader('index/*.md', {
    excerpt: true,
    /**
     * 规范化文章 frontmatter 日期，并按发布时间倒序排列
     * @param raw - VitePress 原始内容数据
     * @returns 处理后的文章列表
     */
    transform(raw): Post[] {
        return raw
            .map(({ frontmatter, ...extra }) => {
                const newData = frontmatter as PostFrontmatter & { date: string };
                const dateRaw = newData.date != null ? new Date(newData.date) : new Date();
                const date = Number.isNaN(dateRaw.getTime()) ? transformDate(new Date(0)) : transformDate(dateRaw);
                return {
                    frontmatter: {
                        ...newData,
                        date,
                    },
                    ...extra,
                };
            })
            .sort((a, b) => b.frontmatter.date.time - a.frontmatter.date.time);
    },
});

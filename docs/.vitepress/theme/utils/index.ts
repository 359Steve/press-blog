import type { GroupedPost, Post } from '../types/content-data';

/** 文章列表统计结果 */
export interface PostStats {
    /** 文章总数 */
    totalPosts: number;
    /** 标签总数 */
    totalTags: number;
    /** 覆盖年份数 */
    totalYears: number;
    /** 分类总数 */
    category: number;
    /** 当前筛选条件下的文章数 */
    filteredPosts: number;
}

/**
 * 将原始日期转换为文章 frontmatter 使用的日期结构
 * @param raw - 待转换的 Date 对象
 * @returns 包含时间戳与中文日期字符串的对象
 */
export function transformDate(raw: Date): Post['frontmatter']['date'] {
    raw.setUTCHours(12);
    return {
        time: +raw,
        string: raw.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    };
}

/**
 * 将月份数字转换为中文月份名称
 * @param month - 月份数字，取值范围 1-12
 * @returns 对应的中文月份名称
 */
export function getMonthName(month: number): string {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const index = Math.max(0, Math.min(month - 1, 11));
    return months[index] ?? '一月';
}

/**
 * 按年份和月份对文章分组，可按标签筛选
 * @param posts - 文章列表
 * @param labelName - 标签名称，空字符串表示不过滤
 * @returns 按时间倒序排列的分组列表
 */
export function groupedPosts(posts: Post[], labelName: string): GroupedPost[] {
    const list = posts ?? [];
    const tagName = labelName;
    const filtered = tagName
        ? list.filter(({ frontmatter: item }) => item.tags?.some((t) => t.name === tagName))
        : list;

    const grouped: Record<string, GroupedPost> = {};

    filtered.forEach((post) => {
        const time = post?.frontmatter.date.time;
        const date = typeof time === 'number' && Number.isFinite(time) ? new Date(time) : new Date(0);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month}`;

        if (!grouped[key]) {
            grouped[key] = {
                year,
                month,
                posts: [],
            };
        }
        grouped[key].posts.push(post);
    });

    return Object.values(grouped).sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year;
        }
        return b.month - a.month;
    });
}

/**
 * 统计文章总数、标签数、年份数、分类数以及当前筛选结果数量
 * @param posts - 文章列表
 * @param labelName - 当前筛选标签，空字符串表示不过滤
 * @returns 文章统计数据
 */
export function stats(posts: Post[], labelName: string): PostStats {
    const allPosts = posts ?? [];
    const allTags = new Set<string>();
    const years = new Set<number>();
    const categorys = new Set<string>();

    allPosts.forEach(({ frontmatter: post }) => {
        post.tags?.forEach((tag) => allTags.add(tag.name));
        years.add(new Date(post.date.time).getFullYear());
        if (Array.isArray(post.category)) {
            post.category.forEach((i) => categorys.add(i));
        }
    });

    return {
        totalPosts: allPosts.length,
        totalTags: allTags.size,
        totalYears: years.size,
        category: categorys.size,
        filteredPosts: labelName
            ? groupedPosts(posts, labelName).reduce((sum, group) => sum + group.posts.length, 0)
            : allPosts.length,
    };
}

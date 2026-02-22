/**
 * 转换日期
 */
export function transformDate(raw: Date): Post['date'] {
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
 * 获取月份名称
 */
export function getMonthName(month: number) {
	const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
	return months[month - 1];
}

/**
 * 获取文章数据
 */
export function groupedPosts(posts: Post[], labelName: string) {
	const list = posts ?? [];
	const tagName = labelName;
	const filtered = tagName ? list.filter((item) => item.tags?.some((t) => t.name === tagName)) : list;

	// 按年份和月份分组
	const grouped: Record<string, GroupedPost> = {};

	filtered.forEach((post) => {
		const date = new Date(post.date.time);
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

	// 转换为数组并按时间倒序排序
	return Object.values(grouped).sort((a, b) => {
		if (a.year !== b.year) {
			return b.year - a.year;
		}
		return b.month - a.month;
	});
}

/**
 * 统计数据
 */
export function stats(posts: Post[], labelName: string) {
	const allPosts = posts ?? [];
	const allTags = new Set<string>();
	const years = new Set<number>();
	const categorys = new Set<string>();

	allPosts.forEach((post) => {
		post.tags?.forEach((tag) => allTags.add(tag.name));
		years.add(new Date(post.date.time).getFullYear());
		categorys.add(post.category);
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

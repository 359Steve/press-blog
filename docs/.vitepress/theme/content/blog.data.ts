import { createContentLoader } from 'vitepress';
import { transformDate } from '../utils';

declare const data: Post[];
export { data };

export default createContentLoader('index/*.md', {
	excerpt: true,
	transform(raw): Post[] {
		return raw
			.map(({ frontmatter, ...extra }) => {
				const dateRaw = frontmatter.date != null ? new Date(frontmatter.date) : new Date();
				const date = Number.isNaN(dateRaw.getTime()) ? transformDate(new Date(0)) : transformDate(dateRaw);
				return {
					title: frontmatter.title ?? '',
					cover: frontmatter.cover ?? '',
					description: frontmatter.description ?? '',
					category: frontmatter.category ?? '',
					date,
					author: frontmatter.author ?? '',
					tags: frontmatter.tags ?? [],
					...extra,
				};
			})
			.sort((a, b) => b.date.time - a.date.time);
	},
});

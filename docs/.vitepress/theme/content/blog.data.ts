import { createContentLoader } from 'vitepress';
import { transformDate } from '../utils';

declare const data: Post[];
export { data };

export default createContentLoader('blog/*.md', {
	excerpt: true,
	transform(raw): Post[] {
		return raw
			.map(({ frontmatter, ...extra }) => ({
				title: frontmatter.title,
				cover: frontmatter.cover,
				description: frontmatter.description,
				date: transformDate(new Date(frontmatter.date)),
				author: frontmatter.author,
				tags: frontmatter.tags,
				...extra,
			}))
			.sort((a, b) => b.date.time - a.date.time);
	},
});

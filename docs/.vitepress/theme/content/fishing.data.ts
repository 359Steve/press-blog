import type { Fishing, FishingFrontmatter } from '../types/content-data';
import { createContentLoader } from 'vitepress';

declare const data: Fishing[];
export { data };

export default createContentLoader('fishing/*.md', {
	excerpt: true,
	transform(raw): Fishing[] {
		return raw.map(({ frontmatter, ...extra }) => {
			const newData = frontmatter as FishingFrontmatter;
			return {
				frontmatter: {
					...newData,
				},
				...extra,
			};
		});
	},
});

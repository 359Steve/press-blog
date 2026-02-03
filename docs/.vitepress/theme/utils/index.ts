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

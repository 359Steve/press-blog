// 获取实况视频
const movModules = Object.entries(
	import.meta.glob<string>('./album/**/*.mov', {
		eager: true,
		query: '?url',
		import: 'default',
	}),
).map(([name, url]) => {
	name = name.replace(/\.\w+$/, '').replace(/^\.\//, '');
	return {
		name,
		url,
	};
});
function metaMov(name: string) {
	return movModules.find((item) => item.name.endsWith(name));
}

// 获取json数据
const metaInfo = Object.entries(
	import.meta.glob<PhotoMate>('./album/**/*.json', {
		eager: true,
		import: 'default',
	}),
).map(([name, data]) => {
	name = name.replace(/\.\w+$/, '').replace(/^\.\//, '');
	return {
		name,
		data,
	};
});

// 获取照片数据
const photos = Object.entries(
	import.meta.glob<string>('./album/**/*.{jpg,png,JPG,PNG}', {
		eager: true,
		query: '?url',
		import: 'default',
	}),
)
	.map(([name, url]): Photo => {
		name = name.replace(/\.\w+$/, '').replace(/^\.\//, '');
		return {
			...metaInfo.find((info) => info.name === name)?.data,
			live: metaMov(name),
			name,
			url,
		};
	})
	.sort((a, b) => b.name.localeCompare(a.name));

export default photos;

<script lang="ts" setup>
import type { Fishing } from '@/theme/types/content-data';
import { data as fishingData } from '@/theme/content/fishing.data';

const router = useRouter();

// 搜索关键词
const keyword = ref<string>('');
const debouncedKeyword = useDebounce(keyword, 300);
// 选择省份
const selectedProvince = ref<string>('');
// 选择城市
const selectedCity = ref<string>('');
// 选择环境类型
const selectedType = ref<string>('');
// 选择鱼类
const selectedCategory = ref<string>('');
// 选择白天或晚上
const nightOnly = ref<boolean>(false);
const columnCount = ref<number>(1);

// 钓点数据
const allItems = computed<Fishing[]>(() => fishingData ?? []);
const searchableItems = computed(() =>
	allItems.value.map((item) => ({
		...item,
		_searchText: [
			item.frontmatter.title,
			item.frontmatter.description,
			item.frontmatter.province,
			item.frontmatter.city,
		]
			.join(' ')
			.toLowerCase(),
	})),
);

// 省份数据
const provinceOptions = computed(() =>
	Array.from(new Set(allItems.value.map((item) => item.frontmatter.province))).sort(),
);

// 城市数据
const cityOptions = computed(() => {
	const list = allItems.value
		.filter((item) => (selectedProvince.value ? item.frontmatter.province === selectedProvince.value : true))
		.map((item) => item.frontmatter.city);
	return Array.from(new Set(list)).sort();
});

// 环境类型数据
const typeOptions = computed(() => Array.from(new Set(allItems.value.map((item) => item.frontmatter.type))).sort());

// 鱼类数据
const categoryOptions = computed(() => {
	const categories = allItems.value.flatMap((item) => item.frontmatter.category ?? []);
	return Array.from(new Set(categories)).sort();
});

watch(selectedProvince, () => {
	selectedCity.value = '';
});

const filteredItems = computed(() => {
	const q = debouncedKeyword.value.trim().toLowerCase();
	return searchableItems.value.filter(({ frontmatter, _searchText }) => {
		const matchProvince = selectedProvince.value ? frontmatter.province === selectedProvince.value : true;
		const matchCity = selectedCity.value ? frontmatter.city === selectedCity.value : true;
		const matchType = selectedType.value ? frontmatter.type === selectedType.value : true;
		const matchCategory = selectedCategory.value ? frontmatter.category?.includes(selectedCategory.value) : true;
		const matchNight = nightOnly.value ? frontmatter.night : true;
		const matchKeyword = q ? _searchText.includes(q) : true;

		return matchProvince && matchCity && matchType && matchCategory && matchNight && matchKeyword;
	});
});
const filteredCount = computed(() => filteredItems.value.length);

const columnedItems = computed(() => {
	const count = Math.max(1, columnCount.value);
	const columns: Fishing[][] = Array.from({ length: count }, () => []);
	filteredItems.value.forEach((item, index) => {
		columns[index % count].push(item);
	});
	return columns;
});

// 重置筛选数据
function resetFilters() {
	keyword.value = '';
	selectedProvince.value = '';
	selectedCity.value = '';
	selectedType.value = '';
	selectedCategory.value = '';
	nightOnly.value = false;
}

onBeforeMount(() => {
	const { width } = useWindowSize();

	const updateColumnCount = (w: number) => {
		if (w >= 1024) columnCount.value = 3;
		else if (w >= 640) columnCount.value = 2;
		else columnCount.value = 1;
	};

	updateColumnCount(width.value);

	watch(width, updateColumnCount);
});
</script>

<template>
	<div class="w-full">
		<div
			class="glass mb-5 grid grid-cols-1 gap-3 rounded-lg border border-black/5 p-4 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/8"
		>
			<input v-model.trim="keyword" type="text" placeholder="搜索钓点名称、描述、城市..." class="input-base" />

			<select v-model="selectedProvince" class="input-base">
				<option value="">全部省份</option>
				<option v-for="province in provinceOptions" :key="province" :value="province">
					{{ province }}
				</option>
			</select>

			<select v-model="selectedCity" class="input-base">
				<option value="">全部城市</option>
				<option v-for="city in cityOptions" :key="city" :value="city">
					{{ city }}
				</option>
			</select>

			<select v-model="selectedType" class="input-base">
				<option value="">全部类型</option>
				<option v-for="type in typeOptions" :key="type" :value="type">
					{{ type }}
				</option>
			</select>

			<select v-model="selectedCategory" class="input-base">
				<option value="">全部鱼种</option>
				<option v-for="category in categoryOptions" :key="category" :value="category">
					{{ category }}
				</option>
			</select>

			<div
				class="flex items-center justify-between gap-3 rounded-md border border-black/8 px-3 py-2 dark:border-white/10"
			>
				<label class="text-blog-secondary inline-flex cursor-pointer items-center gap-2 text-sm">
					<input v-model="nightOnly" type="checkbox" class="accent-(--vp-c-brand-1)" />
					仅看夜钓
				</label>
				<button type="button" class="text-blog-accent text-sm hover:underline" @click="resetFilters">
					清空筛选
				</button>
			</div>
		</div>

		<div class="text-blog-secondary mb-4 text-sm">共 {{ filteredCount }} 个钓点</div>

		<div v-if="filteredCount > 0" class="fishing-masonry w-full" :style="{ '--col-count': columnCount }">
			<div v-for="(column, columnIdx) in columnedItems" :key="`col-${columnIdx}`" class="fishing-masonry__col">
				<div
					v-for="{ frontmatter: item, ...args } in column"
					:key="args.url"
					class="fishing-masonry__item glass flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-black/5 shadow-md transition-all duration-200 hover:-translate-y-0.5 dark:border-white/8"
					@click="router.go(args.url)"
				>
					<div class="bg-blog-primary relative aspect-video w-full shrink-0 overflow-hidden">
						<img
							:src="item.cover"
							:alt="item.title"
							loading="lazy"
							decoding="async"
							class="absolute inset-0 block h-full min-h-full w-full min-w-full object-cover object-center"
						/>
					</div>
					<div class="flex min-h-0 flex-1 flex-col gap-3 p-4">
						<h2 class="text-blog-accent line-clamp-2 text-lg leading-snug font-semibold">
							{{ item.title }}
						</h2>
						<p class="text-blog-secondary line-clamp-2 text-sm leading-relaxed">
							{{ item.description }}
						</p>

						<div class="text-blog-tertiary mt-1 flex flex-wrap items-center gap-3 text-xs">
							<span class="inline-flex items-center gap-1">
								<Icon icon="mdi:map-marker-radius-outline" width="16" height="16" />
								{{ item.province }} · {{ item.city }}
							</span>
							<span class="inline-flex items-center gap-1">
								<Icon icon="mdi:waves" width="16" height="16" />
								{{ item.type }}
							</span>
							<span class="inline-flex items-center gap-1">
								<Icon
									:icon="item.night ? 'mdi:weather-night' : 'mdi:white-balance-sunny'"
									width="16"
									height="16"
								/>
								{{ item.night ? '支持夜钓' : '日钓为主' }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="text-blog-secondary flex flex-col items-center gap-3 py-12 text-center">
			<p>没有找到符合条件的钓点</p>
			<button type="button" class="text-blog-accent hover:underline" @click="resetFilters">查看全部</button>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.fishing-masonry {
	display: flex;
	gap: 1.25rem;
}

.fishing-masonry__col {
	display: flex;
	width: calc((100% - (var(--col-count) - 1) * 1.25rem) / var(--col-count));
	flex-direction: column;
	gap: 1.25rem;
}

.fishing-masonry__item {
	width: 100%;
}

.input-base {
	width: 100%;
	border-radius: 0.5rem;
	border: 1px solid rgb(0 0 0 / 8%);
	background: transparent;
	padding: 0.5rem 0.75rem;
	font-size: 0.875rem;
	outline: none;
	transition: border-color 0.2s ease;

	&:focus {
		border-color: var(--vp-c-brand-1);
	}
}

.dark .input-base {
	border-color: rgb(255 255 255 / 10%);
}
</style>

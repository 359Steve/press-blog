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
	const index = Math.max(0, Math.min(month - 1, 11));
	return months[index] ?? '一月';
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
		const time = post?.date?.time;
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
		if (post.category != null && post.category !== '') {
			categorys.add(post.category);
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

/**
 * 近段进度比例
 * @param duration 动画总时长
 * @param elapsed 过了多长时间
 * @returns number
 */
function defaultEstimatedProgress(duration: number, elapsed: number): number {
	const completionPercentage = (elapsed / duration) * 100;
	return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50);
}

export function createLoadingIndicator(opts: Partial<LoadingProps> = {}) {
	/**
	 * duration：默认动画总时长 2000ms
	 * throttle：显示 loading 前的最短等待时间，防止短请求闪烁
	 * hideDelay：结束后延迟隐藏 loading（避免瞬间消失）
	 * resetDelay：隐藏后延迟重置进度值
	 */
	const { duration = 2000, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;

	// 获取进度比例方法
	const getProgress = opts.estimatedProgress || defaultEstimatedProgress;

	// 进度比例
	const progress = shallowRef(0);
	// 是否显示进度条
	const isLoading = shallowRef(false);
	// 是否报错
	const error = shallowRef(false);

	// 是否完成
	let done = false;
	let rafId: number;

	// 加载进度条之前等待定时器
	let throttleTimeout: number | NodeJS.Timeout;
	// 隐藏进度条定时器
	let hideTimeout: number | NodeJS.Timeout;
	// 重制进度定时器
	let resetTimeout: number | NodeJS.Timeout;

	// 清除定时器
	function clearTimeouts() {
		if (!import.meta.env.SSR) {
			clearTimeout(hideTimeout);
			clearTimeout(resetTimeout);
		}
	}
	function clear() {
		if (!import.meta.env.SSR) {
			clearTimeout(throttleTimeout);
			cancelAnimationFrame(rafId);
		}
	}

	// 隐藏进度条
	function hide() {
		if (!import.meta.env.SSR) {
			hideTimeout = setTimeout(() => {
				isLoading.value = false;
				resetTimeout = setTimeout(() => {
					progress.value = 0;
				}, resetDelay);
			}, hideDelay);
		}
	}

	// 强制完成
	function finish() {
		progress.value = 100;
		done = true;
		clear();
		clearTimeouts();
		hide();
	}

	// 自动递增进度
	function startProgress() {
		// 初始化动画未完成
		done = false;
		// 进度条开始时间
		let startAnimationTime: number;

		const step = (timeAnimation: number) => {
			if (done) return;
			startAnimationTime ??= timeAnimation;
			// 记录过了多长时间
			const elapsed = timeAnimation - startAnimationTime;
			// 计算进度
			progress.value = Math.max(0, Math.min(100, getProgress(duration, elapsed)));

			if (!import.meta.env.SSR) {
				rafId = requestAnimationFrame(step);
			}
		};

		// 启动第一帧
		if (!import.meta.env.SSR) {
			rafId = requestAnimationFrame(step);
		}
	}

	// 设置进度
	function set(at: number) {
		if (import.meta.env.SSR) {
			return;
		}

		// 清理进度条开始加载时的定时器
		clear();

		// 初始化进度从at开始
		progress.value = at;

		if (!import.meta.env.SSR) {
			// 等待 throttle 后显示并加载进度条
			throttleTimeout = setTimeout(() => {
				isLoading.value = true;
				startProgress();
			}, throttle);
		} else {
			// 服务端则直接显示
			isLoading.value = true;
			startProgress();
		}
	}

	const start = () => {
		// 先清除隐藏和重制定时器
		clearTimeouts();
		// 没有报错
		error.value = false;
		// 设置进度
		set(0);
	};

	if (!import.meta.env.SSR) {
		const router = useRouter();
		router.onBeforeRouteChange = () => {
			start();
		};
		router.onAfterRouteChange = () => {
			finish();
		};
	}

	return {
		progress: computed(() => progress.value),
		isLoading: computed(() => isLoading.value),
		error: computed(() => error.value),
		start,
		set,
		finish,
		clear,
	};
}

// 存储唯一的 loading 实例
let loadingIndicator: LoadingIndicator | null = null;
// 记录当前有多少组件在使用这个 loading 指示器
let loadingDeps = 0;

export function useLoadingIndicator(opts: Partial<LoadingProps> = {}): LoadingIndicator {
	if (!loadingIndicator) {
		// 创建 loading 实例
		loadingIndicator = createLoadingIndicator(opts);
	}

	// 判断是否在客户端以及是否在组件响应式作用里
	if (!import.meta.env.SSR && getCurrentScope()) {
		loadingDeps++;

		onScopeDispose(() => {
			loadingDeps--;

			if (loadingDeps === 0) {
				loadingIndicator = null;
			}
		});
	}

	return loadingIndicator!;
}

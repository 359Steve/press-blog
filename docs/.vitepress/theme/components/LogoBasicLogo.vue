<script lang="ts" setup>
import { useRouter } from 'vitepress';
import { nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';

const router = useRouter();
const pathRefs = ref<SVGPathElement[]>([]);
const times = ref<number[]>([0, 1, 1.5, 2.5, 3.2, 4.2]);
const animationTimeouts = ref<ReturnType<typeof setTimeout>[]>([]);
const isAnimating = ref(false);

// 清除所有定时器
function clearAllTimeouts(): void {
	animationTimeouts.value.forEach((timeout) => {
		clearTimeout(timeout);
	});
	animationTimeouts.value = [];
}

// 重置所有路径状态
function resetPaths(): void {
	pathRefs.value.forEach((path) => {
		if (path) {
			path.style.animation = 'none';
			path.style.opacity = '0';
			path.style.strokeDasharray = '350px 0';
			path.style.strokeDashoffset = '1px';
		}
	});
}

function play(): void {
	// 重置所有路径
	resetPaths();

	// 顺序播放 grow 动画
	pathRefs.value.forEach((path, i) => {
		if (path) {
			const timeout = setTimeout(() => {
				if (path) {
					path.style.animation = 'var(--animate-grow)';
				}
			}, times.value[i] * 1000);
			animationTimeouts.value.push(timeout);
		}
	});
}

function reverse(): void {
	const timeout = setTimeout(
		() => {
			const reversed = Array.from(pathRefs.value).reverse();
			reversed.forEach((path, i) => {
				if (path) {
					const reverseTimeout = setTimeout(() => {
						if (path) {
							path.style.animation = 'var(--animate-shrink)';
						}
					}, i * 500);
					animationTimeouts.value.push(reverseTimeout);
				}
			});
		},
		times.value[times.value.length - 1] * 1000 + 4000,
	);

	animationTimeouts.value.push(timeout);
}

function playSequence(): void {
	if (!isAnimating.value) {
		return;
	}

	play();
	reverse();

	const nextSequenceTimeout = setTimeout(
		() => {
			if (isAnimating.value) {
				playSequence();
			}
		},
		times.value[times.value.length - 1] * 1000 * 2 + 2500,
	);

	animationTimeouts.value.push(nextSequenceTimeout);
}

function startAnimation(): void {
	isAnimating.value = true;
	clearAllTimeouts();
	resetPaths();
	nextTick(() => {
		playSequence();
	});
}

function stopAnimation(): void {
	isAnimating.value = false;
	clearAllTimeouts();
	resetPaths();
}

// 监听页面可见性变化
function handleVisibilityChange(): void {
	if (document.hidden) {
		stopAnimation();
	} else {
		// 页面重新可见时，延迟重启动画
		setTimeout(() => {
			startAnimation();
		}, 100);
	}
}

onMounted(() => {
	// 添加页面可见性监听
	document.addEventListener('visibilitychange', handleVisibilityChange);

	nextTick(() => {
		startAnimation();
	});
});

onUnmounted(() => {
	// 清理资源
	document.removeEventListener('visibilitychange', handleVisibilityChange);
	stopAnimation();
});

// 组件激活时重启动画
onActivated(() => {
	startAnimation();
});

// 组件停用时停止动画
onDeactivated(() => {
	stopAnimation();
});
</script>

<template>
	<svg class="h-full stroke-black dark:stroke-white" viewBox="0 0 174.17534 103.05544" @click="router.go('/')">
		<g id="svgGroup">
			<path
				id="path2"
				:ref="(ref: any) => (pathRefs[0] = ref as SVGPathElement)"
				style="
					fill: none;
					fill-opacity: 0;
					stroke-width: 3.77953;
					stroke-linecap: square;
					stroke-linejoin: round;
					stroke-dasharray: none;
					stroke-opacity: 1;
				"
				d="m 35.493626,74.937635 c 0,0 -19.445267,-1.637496 -23.743695,-19.035893 C 7.451503,38.503345 19.528038,13.940902 34.674878,5.7534218 49.821718,-2.4340592 54.120145,4.1159248 53.506084,10.051849 52.892023,15.987773 47.160786,39.52678 37.745183,58.972047 28.32958,78.417314 23.212405,89.265727 16.253046,96.429772 9.293687,103.59381 -4.625031,104.61725 5.404633,84.967299 15.434298,65.317345 47.774847,54.264246 47.774847,54.264246"
			/>
			<path
				id="path3"
				:ref="(ref: any) => (pathRefs[1] = ref as SVGPathElement)"
				style="
					fill: none;
					fill-opacity: 0;
					stroke-width: 3.77953;
					stroke-linecap: round;
					stroke-linejoin: round;
					stroke-dasharray: none;
					stroke-opacity: 1;
				"
				d="m 69.471672,36.456475 c 0,0 -17.603084,12.281221 -16.784336,27.018687 0.818748,14.737465 15.351527,6.549985 21.696824,-5.731237 5.884041,-11.388468 6.345298,-21.696824 -3.070305,-16.989023 -9.415603,4.707802 -7.164046,19.035893 -0.614061,19.649954 6.549985,0.614062 8.123846,-0.776325 12.485908,-3.684366 4.912489,-3.274992 14.737466,-16.170275 14.737466,-16.170275"
			/>
			<path
				id="path4"
				:ref="(ref: any) => (pathRefs[2] = ref as SVGPathElement)"
				style="
					fill: none;
					fill-opacity: 0;
					stroke-width: 3.77953;
					stroke-linecap: round;
					stroke-linejoin: round;
					stroke-dasharray: none;
					stroke-opacity: 1;
				"
				d="m 101.81222,32.567421 c 0,0 -6.613879,2.748112 -3.070304,6.959359 4.578944,5.441695 3.274994,24.971817 -11.871847,31.931176 -14.715904,6.761361 0.614061,-11.462474 0.204687,-7.57342 -0.409374,3.889053 8.392168,21.28745 25.381194,-11.053099"
			/>
			<path
				id="path5"
				:ref="(ref: any) => (pathRefs[3] = ref as SVGPathElement)"
				style="
					fill: none;
					fill-opacity: 0;
					stroke-width: 3.77953;
					stroke-linecap: square;
					stroke-linejoin: round;
					stroke-dasharray: none;
					stroke-opacity: 1;
				"
				d="m 113.07001,57.948612 c 0,0 11.25778,0.204687 16.57965,-8.392168 5.32186,-8.596855 3.0703,-16.374962 -9.21092,-7.368733 -12.28123,9.006229 -15.55621,35.820229 1.84218,26.814 17.3984,-9.006229 39.70928,-50.353007 39.70928,-50.353007"
			/>
			<path
				id="path6"
				:ref="(ref: any) => (pathRefs[4] = ref as SVGPathElement)"
				style="
					fill: none;
					fill-opacity: 0;
					stroke-width: 3.77953;
					stroke-linecap: butt;
					stroke-linejoin: bevel;
					stroke-dasharray: none;
					stroke-opacity: 1;
					paint-order: normal;
				"
				d="m 151.96054,44.029895 c 0,0 9.82498,-4.707802 17.60309,-18.626519 7.7781,-13.918718 -2.86562,-19.8546412 -10.02967,-1.637497 -7.16404,18.217145 -30.08899,73.277954 -30.08899,73.277954 l 8.80154,-21.28745 c 0,0 1.84218,0.818748 10.64373,-7.57342 8.80154,-8.392168 14.1234,-14.737465 14.1234,-14.737465"
			/>
		</g>
	</svg>
</template>

<style lang="postcss" scoped>
path {
	@apply fill-none stroke-3 opacity-0 [stroke-dasharray:350px_0] [stroke-dashoffset:1px] [stroke-linecap:round] [stroke-linejoin:round];
}
</style>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef } from 'vue';

// 仙人掌对象类型
interface CactusType {
	x: number;
	y: number;
	width: number;
	height: number;
}

const DinoBox = useTemplateRef<HTMLElement>('DinoBox');
const dinoParameter = reactive({
	width: 0,
	height: 0,
});

// 创建图片元素
function createImage(src: string) {
	const img = new Image();
	img.src = src;
	return img;
}

const Dino = useTemplateRef<HTMLCanvasElement>('Dino');
const ctx = ref<CanvasRenderingContext2D | null>(null);
// 恐龙运动时图片
const dinoRunImg = computed(() => [
	createImage('/images/dino/dino-run-0.png'),
	createImage('/images/dino/dino-run-1.png'),
]);
// 恐龙初始化图片
const dinoStaticImg = computed(() => createImage('/images/dino/dino-stationary.png'));
// 恐龙失败图片
const dinoLoseImg = computed(() => createImage('/images/dino/dino-lose.png'));
// 道路图片
const groundImg = computed(() => createImage('/images/dino/ground.png'));
// 仙人掌图片
const cactusImg = computed(() => createImage('/images/dino/cactus.png'));

// 游戏常量
const gameStatic = reactive({
	GROUND_Y: 200, // 地面Y坐标
	GRAVITY: 0.0021, // 重力加速度
	JUMP_SPEED: 0.65, // 跳跃初速度
	SPEED_INCREASE: 0.00002, // 速度增加量
	MIN_CACTUS_DISTANCE: 120, // 最小仙人掌距离
});
// 状态常量
const gameState = reactive({
	playing: false, // 游戏进行中
	score: 0, // 分数
	speedScale: 1, // 速度倍数
	lastTime: 0, // 上一帧时间戳
	groundX: 0, // 地面X坐标
});

// 恐龙对象
const dino = reactive({
	x: 40,
	y: gameStatic.GROUND_Y,
	width: 44,
	height: 47,
	vy: 0,
	isJumping: false,
	frame: 0,
	frameTimer: 0,
	frameInterval: 100,
	currentImg: dinoStaticImg.value,
});
// 仙人掌对象
const cactuses = ref<CactusType[]>([]);

// 更新地面位置
function updateGround(delta: number) {
	gameState.groundX -= delta * 0.3 * gameState.speedScale;
	if (gameState.groundX <= -dinoParameter.width) {
		gameState.groundX = 0;
	}
}

// 更新恐龙
function updateDino(delta: number) {
	// 跳跃
	if (dino.isJumping) {
		dino.vy -= gameStatic.GRAVITY * delta;
		dino.y -= dino.vy * delta;

		if (dino.y >= gameStatic.GROUND_Y) {
			dino.y = gameStatic.GROUND_Y;
			dino.isJumping = false;
			dino.vy = 0;
		}
	}

	// 动画切换
	if (!dino.isJumping) {
		dino.frameTimer += delta * gameState.speedScale;
		if (dino.frameTimer > dino.frameInterval) {
			dino.frame = (dino.frame + 1) % 2;
			dino.frameTimer = 0;
		}
		dino.currentImg = dinoRunImg.value[dino.frame];
	} else {
		dino.currentImg = dinoStaticImg.value;
	}
}

// 更新仙人掌
function updateCactus(delta: number) {
	const last = cactuses.value[cactuses.value.length - 1];

	const canSpawn = !last || last.x < dinoParameter.width - gameStatic.MIN_CACTUS_DISTANCE;

	if (canSpawn && Math.random() < 0.008 * gameState.speedScale) {
		cactuses.value.push({
			x: dinoParameter.width,
			y: gameStatic.GROUND_Y,
			width: 25,
			height: 50,
		});
	}

	cactuses.value.forEach((item) => {
		item.x -= delta * 0.3 * gameState.speedScale;
	});
	cactuses.value = cactuses.value.filter((item) => {
		return item.x + item.width > 0;
	});
}

// 更新速度
function updateSpeedScale(delta: number) {
	gameState.speedScale += gameStatic.SPEED_INCREASE * delta;
}

// 更新分数
function updateScore(delta: number) {
	gameState.score += delta * 0.01;
}

// 加载画面
function renderGame(playing: boolean) {
	ctx.value?.clearRect(0, 0, dinoParameter.width, dinoParameter.height);
	// 画地面
	ctx.value?.drawImage(groundImg.value, gameState.groundX, gameStatic.GROUND_Y - 18, dinoParameter.width, 40);
	ctx.value?.drawImage(
		groundImg.value,
		gameState.groundX + dinoParameter.width,
		gameStatic.GROUND_Y - 18,
		dinoParameter.width,
		40,
	);
	// 画恐龙
	ctx.value?.drawImage(dino.currentImg, dino.x, dino.y - dino.height, dino.width, dino.height);

	if (!playing) {
		return;
	}

	// 画仙人掌
	cactuses.value.forEach((item) => {
		ctx.value?.drawImage(cactusImg.value, item.x, item.y - item.height, item.width, item.height);
	});
}

// 检查碰撞
function checkCollision() {
	const HITBOX_PADDING = 8;
	const dinoBox = {
		left: dino.x + HITBOX_PADDING,
		right: dino.x + dino.width - HITBOX_PADDING,
		top: dino.y - dino.height + HITBOX_PADDING,
		bottom: dino.y - HITBOX_PADDING,
	};

	return cactuses.value.some((c) => {
		const cactusRect = {
			left: c.x + HITBOX_PADDING,
			right: c.x + c.width - HITBOX_PADDING,
			top: c.y - c.height + HITBOX_PADDING,
			bottom: c.y - HITBOX_PADDING,
		};

		return !(
			dinoBox.right < cactusRect.left ||
			dinoBox.left > cactusRect.right ||
			dinoBox.bottom < cactusRect.top ||
			dinoBox.top > cactusRect.bottom
		);
	});
}

// 处理失败
function handleLose() {
	gameState.playing = false;
	dino.currentImg = dinoLoseImg.value;
	setTimeout(() => {
		document.addEventListener('keydown', startGame, { once: true });
	}, 300);
}

// 游戏循环
function update(time: number) {
	// 首次调用初始化时间戳
	if (!gameState.lastTime) {
		gameState.lastTime = time;
		requestAnimationFrame(update);
		return;
	}

	// 计算时间差
	const delta = time - gameState.lastTime;
	// 更新地面位置
	updateGround(delta);
	// 更新恐龙
	updateDino(delta);
	// 更新仙人掌
	updateCactus(delta);
	// 更新速度
	updateSpeedScale(delta);
	// 更新分数
	updateScore(delta);

	// 加载画面
	renderGame(true);

	if (checkCollision()) {
		return handleLose();
	}

	gameState.lastTime = time;
	requestAnimationFrame(update);
}

// 开始游戏
function startGame() {
	gameState.playing = true;
	gameState.score = 0;
	gameState.speedScale = 1;
	cactuses.value = [];
	dino.y = gameStatic.GROUND_Y;
	dino.vy = 0;
	dino.isJumping = false;
	dino.currentImg = dinoStaticImg.value;
	gameState.lastTime = 0;

	requestAnimationFrame(update);
}

function handleJump() {
	if (!gameState.playing) {
		startGame();
	}

	// 跳跃
	if (!dino.isJumping) {
		dino.vy = gameStatic.JUMP_SPEED;
		dino.isJumping = true;
	}
}

onMounted(() => {
	nextTick(() => {
		if (Dino.value && DinoBox.value) {
			const width = DinoBox.value.clientWidth;
			const height = DinoBox.value.clientHeight;
			dinoParameter.width = width;
			dinoParameter.height = height;
			Dino.value.width = width;
			Dino.value.height = height / 2;
			ctx.value = Dino.value.getContext('2d');

			dinoStaticImg.value.onload = () => {
				groundImg.value.onload = () => {
					renderGame(false);
				};
			};

			document.addEventListener('keydown', startGame, { once: true });
			document.addEventListener('keydown', handleJump);
			document.addEventListener('touchstart', handleJump, { passive: false });
		}
	});
});

onBeforeUnmount(() => {
	document.removeEventListener('keydown', startGame);
	document.removeEventListener('keydown', handleJump);
	document.removeEventListener('touchstart', handleJump);
});
</script>

<template>
	<div class="flex h-screen w-full items-center justify-center">
		<div ref="DinoBox" class="relative h-100 w-full">
			<div class="relative flex h-1/2 w-full items-center justify-center p-4">
				<div
					class="glass text-blog-primary dark:text-blog-primary absolute top-4 right-4 z-10 rounded bg-white/70 px-3 py-1 text-sm font-medium shadow-md dark:bg-gray-800/70"
				>
					分数: {{ Math.floor(gameState.score) }}
				</div>
				<div>
					<p v-if="!gameState.playing" class="text-blog-tertiary text-center text-[16px]">暂无内容</p>
					<p v-if="!gameState.playing" class="text-blog-tertiary hidden text-center text-[16px] md:block">
						按任意键开始游戏
					</p>
					<p v-if="!gameState.playing" class="text-blog-tertiary block text-center text-[16px] md:hidden">
						点击屏幕开始游戏
					</p>
				</div>
			</div>
			<canvas ref="Dino" />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>

---
layout: index
index: true
title: '封装 BJBN 3.0通用地图组件'
cover: '/images/posts/bjbn-map/1.png'
description: '第一次参加工作给公司封装的第一个插件bjbn-map-container，也是我第一个开源项目'
category:
    - map
tags:
    - name: Map
      icon: mdi:map-check
      color: #000000
      url: https://www.geomapapp.org/
    - name: GitHub
      icon: ri:github-fill
      color: #000000
      url: https://github.com/359Steve/bjbn-map.git
date: 2025-08-20
---

---

> 第一次做开源插件，心理上会觉得“应该很难”，但真正拆开来看，其实就是不断解决具体问题的过程。

> 感谢谢组长在设计和细节上的补充与完善，下面就记录一下**BJBN 3.0 通用地图组件** 从 0 到 1 的封装过程。

---

## 封装的背景与动机

在公司项目中，**地图几乎是每个核心页面的基础模块**。虽然底层地图资源和配置是统一提供的，但在实际开发中，每个页面都需要重复做以下事情：

- 手动引入地图 JS 资源

- 初始化地图实例

- 读取并合并配置

- 绑定容器并渲染

- 处理销毁与重新加载

这些步骤在不同页面中高度重复，不仅开发成本高，而且一旦地图 SDK 或初始化逻辑发生变动，维护成本也会成倍增加。于是我开始思考：

> **能不能把“加载 + 初始化 + 渲染”这一整套流程封装成一个组件，让业务页面只关心“我想用什么地图”？**

这个想法，便是 MapContainer 的起点。

---

## 渲染地图

### 设计目标

第一版的目标非常克制，只解决[「地图能不能快速渲染出来」]这个问题。不考虑切换、不考虑状态、不考虑复杂交互。组件对外只暴露最小必要参数，容器 ID、宽高、地图配置。

### 核心思路

1. 按需加载地图 SDK

2. SDK 加载完成后，通过官方工厂方法初始化地图

3. 将地图实例通过 `expose` 暴露给外部

这版组件的存在意义只有一个,**让页面只写一行组件，就能看到地图**。从结果来看，它确实达成了这个目的，但很快问题也暴露出来了。

---

## 问题出现

随着项目推进，地图相关的需求逐渐复杂：

- 同一个页面需要在多套地图配置之间切换

- 切换地图时，旧实例需要被正确销毁

- 地图缩放、中心点、视角等状态需要可控

- 地图对象要能被业务工具（绘制、编辑、回放）复用

如果继续在业务页面里“补逻辑”，那最初封装组件的意义就不存在了。于是，组件开始进入 **第二阶段进化**。

---

## 引入“地图切换”的能力

### 为什么选择组件内部切换

一开始我考虑过：由父组件完全控制地图销毁与重建，但很快发现，这会让父组件承担大量与地图 SDK 强耦合的逻辑。最终决定：地图的生命周期，应该完全由 MapContainer 负责。业务层只需要告诉我：当前选中的是哪一套地图配置。

### mapConfigs + currentMapConfig

组件开始接收两类配置：

- mapConfigs：所有可选地图的集合

- currentMapConfig：当前正在使用的地图

通过 `v-model`（`update:currentMapConfig`），实现**受控切换**。

当 `currentMapConfig` 变化时：

1. 清空旧地图 DOM

2. 卸载旧地图实例

3. 重新加载 JS

4. 初始化新地图

这一步，正式让组件从“展示型组件”进化成了“逻辑型组件”。

---

## 地图生命周期管理

在实际使用中，一个很关键的点是：

> **地图如果不彻底清理，就一定会出问题。**

**reset 的必要性**

在组件中，我单独抽出了 reset 方法，用来做几件事：

- 清空地图实例引用

- 清空内部工具（draw / edit / playback 等）

- 清空容器 DOM，避免重复渲染

这一层“兜底”，极大降低了切换地图时的异常概率。

**resetMapState**

除了销毁，还有一种更常见的需求：回到「初始视角」。因此我又封装了 resetMapState：

- 重置 zoom

- 重置 center

- 重置 bearing

- 重置 bounds

并且直接基于 `currentMapConfig.config`，保证配置即状态源。

---

## 对外能力暴露

一个组件如果“过度封装”，反而会限制业务。所以在设计时，我保留了一个原则：

> **核心流程我来管，能力你可以随时拿走。**

### expose 的内容

- 通过 expose，对外提供：

- mapObj（地图实例）

- bnmap（底层原始实例）

- resetMapState

- draw / edit / playback 等扩展能力

---

## BJBN 3.0 通用地图组件

回过头看整个过程，其实并不是“一次性设计出完美架构”，而是：

1. **先解决最痛的问题**

2. 再随着真实需求不断调整边界

3. 把“不该出现在业务层的逻辑”逐步收回来

现在的 `bjbn-map-container` 能加载、能切换、能重置、能扩展。它不复杂，但足够稳定，也足够克制。

---

## 一些个人感受

第一个开源项目，不必追求“架构完美”，真实业务，是最好的设计文档，封装的本质不是隐藏，而是分层，希望这篇记录，能给正在做组件封装的你一点参考。如果你也在做地图相关的封装，欢迎一起交流👋

---

::: details

```js
import { ElSelect, ElOption } from 'element-plus';
import {
	defineComponent,
	h,
	onBeforeMount,
	onMounted,
	onBeforeUnmount,
	ref,
	watch,
	watchEffect,
	nextTick,
	computed,
	CSSProperties,
	PropType,
} from 'vue';
import { loadScript } from 'vue-plugin-load-script';
import { MapConfigVo, MapObj } from './types';

// 地图初始化方法类型
interface BNMap {
	BFactory: {
		Load: (mapId: string, config: MapConfigVo['config'], callback: (map: any) => void) => void;
	};
}
// 引入地图js
declare const BNMap: BNMap;

export default defineComponent({
	name: 'MapContainer',
	props: {
		boxId: { type: String, required: true },
		mapConfigs: { type: Array<MapConfigVo>, required: true },
		showSelect: { type: Boolean, default: false },
		left: { type: Number },
		right: { type: Number, default: 30 },
		bottom: { type: Number },
		top: { type: Number, default: 30 },
		width: { type: Number, default: 150 },
		height: { type: Number, default: 32 },
		currentMapConfig: { type: Object as PropType<MapConfigVo>, required: true },
	},
	emits: {
		initGeoBox: (_mapObj: MapObj) => true,
		mapChange: (_msg: boolean, _mapId: string) => true,
		'update:currentMapConfig': (_val: MapConfigVo) => true,
	},
	setup(props, { expose, emit }) {
		const scriptElement = ref<HTMLScriptElement | null>(null);
		const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);

		const mapObj = ref<any>(null);
		const bnmap = ref<any>(null);
		const draw = ref<any>(null);
		const edit = ref<any>(null);
		const playback = ref<any>(null);
		const control = ref<any>(null);

		const selectMap = ref<string>(props.currentMapConfig.id);

		const updateMapConfig = (val: MapConfigVo) => {
			emit('update:currentMapConfig', val);
		};

		const handleMapChange = (id: string) => {
			updateMapConfig(props.mapConfigs.find((item: MapConfigVo) => item.id === id) as MapConfigVo);
		};

		const styleObj = computed(
			(): CSSProperties => ({
				left: `${props.left}px`,
				top: `${props.top}px`,
				right: `${props.right}px`,
				bottom: `${props.bottom}px`,
				width: `${props.width}px`,
				height: `${props.height}px`,
			}),
		);

		// 重置
		const reset = () => {
			// 清空地图
			mapObj.value = null;
			bnmap.value = null;
			draw.value = null;
			edit.value = null;
			playback.value = null;

			// 清空容器，避免重复渲染
			const container = document.getElementById(props.boxId);
			if (container) container.innerHTML = '';
		};

		// 获取选择框元素
		const getSelect = async () => {
			await nextTick();
			if (selectRef.value) {
				const wrapper = selectRef.value.$el.querySelector('.el-select__wrapper') as HTMLElement;
				if (wrapper) {
					wrapper.style.height = `${props.height}px`;
				}
			}
		};

		// 重置地图状态方法
		const resetMapState = () => {
			if (!mapObj.value) {
				console.warn('地图对象未初始化，无法重置地图状态');
				return;
			}

			if (!props.currentMapConfig || !props.currentMapConfig.config) {
				console.warn('地图配置未初始化，无法重置地图状态');
				return;
			}
			const { zoom, center, bearing, boxZoom, bounds } = props.currentMapConfig.config;

			try {
				// 重置zoom
				if (zoom !== undefined) {
					mapObj.value.setZoom(zoom);
				}

				// 重置center
				if (center) {
					mapObj.value.setCenter(center);
				}

				// 重置bearing
				if (bearing !== undefined) {
					mapObj.value.setBearing(bearing);
				}

				// 重置boxZoom
				if (boxZoom !== undefined) {
					if (boxZoom) {
						mapObj.value.boxZoom.enable();
					} else {
						mapObj.value.boxZoom.disable();
					}
				}

				// 重置bounds
				if (bounds) {
					mapObj.value.fitBounds(bounds, { padding: 50, duration: 1000 });
				}

				console.log('地图状态重置成功');
			} catch (error) {
				console.error('重置地图状态时发生错误:', error);
			}
		};

		// 封装初始化地图
		const initMap = async () => {
			if (scriptElement.value) {
				// 先删除
				scriptElement.value.remove();
			}
			// 加载地图 js
			scriptElement.value = await loadScript(props.currentMapConfig.config.apiUrl);

			reset();

			// 初始化
			BNMap.BFactory.Load(
				props.currentMapConfig.config.mapId,
				{
					container: props.boxId,
					...props.currentMapConfig.config,
				},
				(map: any) => {
					mapObj.value = map;
					bnmap.value = map._innerMap;

					let mapInstance = {
						mapObj: mapObj.value,
						bnmap: bnmap.value,
						BNMap: BNMap,
					};
					// 将地图对象赋值给geoBox工具文件
					emit('initGeoBox', mapInstance);
				},
			);
		};

		// 初始加载
		onBeforeMount(() => {
			initMap();
		});

		onMounted(() => {
			getSelect();
		});

		onBeforeUnmount(() => {
			reset();
		});

		// 监听切换
		watch(selectMap, async () => {
			emit('mapChange', true, props.currentMapConfig.id);
			reset();
			await nextTick();
			await initMap();
		});

		watchEffect(async () => {
			if (props.height) {
				getSelect();
			}
		});

		expose({
			mapObj,
			bnmap,
			draw,
			edit,
			playback,
			resetMapState,
			control,
		});

		return () =>
			h(
				'div',
				{
					style: {
						width: '100%',
						height: '100%',
						position: 'absolute',
						display: 'flex',
					},
				},
				[
					// 地图容器
					h('div', {
						id: props.boxId,
						style: {
							width: '100%',
							height: '100%',
							background: props.currentMapConfig.background,
						},
					}),
					// 下拉框
					props.showSelect
						? h(
								'div',
								{
									style: {
										position: 'absolute',
										zIndex: 999,
										...styleObj.value,
									},
								},
								[
									h(
										ElSelect,
										{
											ref: selectRef,
											modelValue: selectMap.value,
											placeholder: '请选择地图',
											'onUpdate:modelValue': (val: string) => {
												selectMap.value = val;
											},
											onChange: handleMapChange,
											style: { width: '100%', height: 'auto' },
										},
										() =>
											props.mapConfigs.map((item: MapConfigVo) =>
												h(ElOption, { key: item.id, label: item.name, value: item.id }),
											),
									),
								],
							)
						: null,
				],
			);
	},
});
```

:::

```vue
<MapContainer
	v-if="mapConfigs && mapConfigs.length > 0"
	box-id="Map"
	:show-select="true"
	:map-configs="mapConfigs"
	v-model:currentMapConfig="currentMapConfig"
	:right="30"
	:top="30"
	:width="150"
	:height="32"
	@map-change="mapChange"
	@init-geo-box="initGeoBox"
>
</MapContainer>
```

> 项目地址：[GitHub](https://github.com/359Steve/bjbn-map.git)

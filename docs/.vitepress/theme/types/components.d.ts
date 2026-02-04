import type { DefineComponent } from 'vue';
import type { Icon } from '@iconify/vue';
import type { Content } from 'vitepress';

declare module 'vue' {
	export interface GlobalComponents {
		Icon: DefineComponent<Partial<InstanceType<typeof Icon>['$props']>>;
		Content: DefineComponent<Partial<InstanceType<typeof Content>['$props']>>;
	}
}

import type { Directive } from 'vue';

/** 判断指定节点是否需要被拆包的回调 */
type UnwrapPredicate = (el: HTMLElement) => boolean;

/** 指令值：函数、布尔值或未传值 */
type UnwrapValue = UnwrapPredicate | boolean | undefined;

/**
 * 将匹配标签的节点替换为其子节点，实现拆包
 * @param el - 指令绑定的根元素
 * @param tag - 需要拆包的标签名
 * @param predicate - 是否拆包的判定条件
 */
function runUnwrap(el: HTMLElement, tag: string, predicate: UnwrapValue): void {
    const nodes = el.querySelectorAll<HTMLElement>(tag);

    nodes.forEach((node) => {
        let shouldUnwrap = true;

        if (typeof predicate === 'function') {
            shouldUnwrap = predicate(node);
        } else if (predicate === false) {
            shouldUnwrap = false;
        }

        if (!shouldUnwrap) {
            return;
        }

        if (node.childNodes.length > 0) {
            node.replaceWith(...node.childNodes);
        }
    });
}

export const unwrap: Directive<HTMLElement, UnwrapValue> = {
    /**
     * 元素挂载后拆包指定标签
     * @param el - 指令绑定的根元素
     * @param binding - 指令参数与判定条件
     */
    mounted(el, binding): void {
        const tag = binding.arg || 'p';
        const predicate = binding.value;
        queueMicrotask(() => runUnwrap(el, tag, predicate));
    },

    /**
     * 元素更新后重新拆包指定标签
     * @param el - 指令绑定的根元素
     * @param binding - 指令参数与判定条件
     */
    updated(el, binding): void {
        const tag = binding.arg || 'p';
        const predicate = binding.value;
        queueMicrotask(() => runUnwrap(el, tag, predicate));
    },
};

import type { Directive } from 'vue';

type UnwrapPredicate = (el: HTMLElement) => boolean;

type UnwrapValue = UnwrapPredicate | boolean | undefined;

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

		node.replaceWith(...node.childNodes);
	});
}

export const unwrap: Directive<HTMLElement, UnwrapValue> = {
	mounted(el, binding) {
		const tag = binding.arg || 'p';
		const predicate = binding.value;
		queueMicrotask(() => runUnwrap(el, tag, predicate));
	},

	updated(el, binding) {
		const tag = binding.arg || 'p';
		const predicate = binding.value;
		queueMicrotask(() => runUnwrap(el, tag, predicate));
	},
};

import antfu from '@antfu/eslint-config';

export default antfu({
	vue: true,
	typescript: true,
	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: true,
	},
	rules: {
		'unused-imports/no-unused-vars': 'warn',
		'style/brace-style': 'warn',
		'ts/no-empty-object-type': 'warn',
		'style/no-tabs': 'off',
	},
});

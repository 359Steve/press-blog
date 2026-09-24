import antfu from '@antfu/eslint-config';

export default antfu(
    {
        vue: true,
        typescript: true,
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },
        ignores: ['**/dist', '**/node_modules', '**/.vite', '**/auto-imports.d.ts', '**/components.d.ts', 'public/**'],
        rules: {
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'style/brace-style': 'warn',
            'ts/no-empty-object-type': 'warn',
            'style/no-tabs': 'off',
            'style/operator-linebreak': 'off',
            'style/arrow-parens': 'warn',
            'antfu/if-newline': 'warn',
            'antfu/no-top-level-await': 'warn',
        },
    },
    {
        files: ['**/*.d.ts'],
        rules: {
            'unused-imports/no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'off',
        },
    },
);

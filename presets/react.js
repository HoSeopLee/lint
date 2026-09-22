import js from '@eslint/js';
import tseslint from 'typescript-eslint';

import { browserGlobals } from '../rules/base/globals.js';
import importConfig from '../rules/base/imports.js';
import { generalRules } from '../rules/base/javascript.js';
import tsConfig from '../rules/typescript/ts.js';
import reactConfig from '../rules/react/react.js';
import a11yConfig from '../rules/accessibility/a11y.js';
import prettierConfig from '../rules/formatting/prettier.js';

export default [
	{
		ignores: [
			'dist/**',
			'node_modules/**',
			'public/**',
			'*.config.js',
			'*.config.ts',
			'.prettierrc.js',
			'vite.config.ts',
			'build/**',
			'coverage/**',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			...reactConfig.plugins,
			...importConfig.plugins,
			...a11yConfig.plugins,
			...prettierConfig.plugins,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			globals: browserGlobals,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		settings: {
			...reactConfig.settings,
			...importConfig.settings,
		},
		rules: {
			...tsConfig.rules,
			...importConfig.rules,
			...reactConfig.rules,
			...a11yConfig.rules,
			...prettierConfig.rules,
			...generalRules,
		},
	},
	{
		files: ['**/*.{js,jsx}'],
		plugins: {
			...reactConfig.plugins,
			...importConfig.plugins,
			...a11yConfig.plugins,
			...prettierConfig.plugins,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			globals: browserGlobals,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		settings: {
			...reactConfig.settings,
			...importConfig.settings,
		},
		rules: {
			...importConfig.rules,
			...reactConfig.rules,
			...a11yConfig.rules,
			...prettierConfig.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			...generalRules,
		},
	},
	{
		files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
];

import js from '@eslint/js';
import { browserGlobals } from '../rules/base/globals.js';
import importConfig from '../rules/base/imports.js';
import { generalRules } from '../rules/base/javascript.js';
import prettierConfig from '../rules/formatting/prettier.js';

/**
 * 기본 프리셋: JS + import + prettier
 * React/TypeScript 없이 사용 (예: Node 스크립트, 향후 확장용)
 */
export default [
	{
		ignores: [
			'dist/**',
			'node_modules/**',
			'build/**',
			'coverage/**',
			'*.config.js',
			'*.config.ts',
		],
	},
	js.configs.recommended,
	{
		files: ['**/*.js'],
		plugins: {
			...importConfig.plugins,
			...prettierConfig.plugins,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			globals: browserGlobals,
			parserOptions: { sourceType: 'module' },
		},
		settings: importConfig.settings,
		rules: {
			...importConfig.rules,
			...prettierConfig.rules,
			...generalRules,
		},
	},
];

import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * rules/formatting/prettier.js — Prettier 통합 (configs/prettier.js 대응)
 * - prettier/prettier: error
 * - eslint-config-prettier: Prettier와 충돌하는 ESLint 규칙 전부 off
 */
export default {
	plugins: {
		prettier,
	},
	rules: {
		'prettier/prettier': ['error'],
		...(eslintConfigPrettier.rules || eslintConfigPrettier),
	},
};

import tseslint from 'typescript-eslint';

/**
 * rules/typescript/ts.js — TypeScript 규칙, 적용: *.{ts,tsx} (configs/ts.js 대응)
 * 라인별: 규칙 설명 + (warn/error/off)
 */
export default {
	files: ['**/*.{ts,tsx}'],
	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			sourceType: 'module',
		},
	},
	plugins: {
		'@typescript-eslint': tseslint.plugin,
	},
	rules: {
		// no-useless-catch (off)
		'no-useless-catch': 'off',
		// 반환 타입 명시 강제 안 함 (off)
		'@typescript-eslint/explicit-function-return-type': 'off',
		// 사용 전 정의 강제 완화 (off)
		'@typescript-eslint/no-use-before-define': 'off',
		// 변수: camelCase, PascalCase, UPPER_CASE, snake_case 허용 (warn)
		// 함수: camelCase, PascalCase (warn)
		// typeLike: PascalCase (warn)
		// interface I 접두사 금지, typeAlias/typeParameter T 접두사 금지 (warn)
		'@typescript-eslint/naming-convention': [
			'warn',
			{ selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'] },
			{ selector: 'function', format: ['camelCase', 'PascalCase'] },
			{ selector: 'typeLike', format: ['PascalCase'] },
			{ selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: false } },
			{ selector: 'typeAlias', format: ['PascalCase'], custom: { regex: '^T[A-Z]', match: false } },
			{ selector: 'typeParameter', format: ['PascalCase'], custom: { regex: '^T[A-Z]', match: false } },
		],
		// 미사용 변수는 unused-imports 플러그인으로 처리 (off)
		'@typescript-eslint/no-unused-vars': 'off',
		// 루프 안 함수 제한 (off)
		'@typescript-eslint/no-loop-func': 'off',
		// default 파라미터 위치 (off)
		'@typescript-eslint/default-param-last': 'off',
		// 변수 shadowing (off)
		'@typescript-eslint/no-shadow': 'off',
		// 클래스 멤버 사이 빈 줄 (off)
		'@typescript-eslint/lines-between-class-members': 'off',
		// throw 리터럴 (off)
		'@typescript-eslint/no-throw-literal': 'off',
		// namespace (off)
		'@typescript-eslint/no-namespace': 'off',
		// ?? 선호 (off)
		'@typescript-eslint/prefer-nullish-coalescing': 'off',
		// any 사용 경고 (warn)
		'@typescript-eslint/no-explicit-any': 'warn',
		// 빈 함수 경고 (warn)
		'@typescript-eslint/no-empty-function': 'warn',
		// as const 사용 권장 (error)
		'@typescript-eslint/prefer-as-const': 'error',
	},
};

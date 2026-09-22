/**
 * rules/base/javascript.js — React/Next 공통 JS 규칙 (configs/base-rules.js 대응)
 * 라인별: 규칙 설명 + (warn/error/off)
 */
export const generalRules = {
	// console 사용 허용 (off)
	'no-console': 'off',
	// 함수 매개변수 재할당 허용 (off)
	'no-param-reassign': 'off',
	// ++/-- for 루프 증감식만 허용 (error)
	'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
	// 배열 메서드 콜백에서 return 필수 (warn)
	'array-callback-return': 'warn',
	// for...in 시 hasOwnProperty 체크 권장 (warn)
	'guard-for-in': 'warn',
	// 특정 문법 제한 없음 (off)
	'no-restricted-syntax': 'off',
	// class 메서드에 this 필수 아님 (off)
	'class-methods-use-this': 'off',
	// _ 로 시작/끝 식별자 허용 (off)
	'no-underscore-dangle': 'off',
	// switch case fallthrough 방지 (warn)
	'no-fallthrough': 'warn',
	// switch default 필수 아님 (off)
	'default-case': 'off',
	// 생성자에서 return 방지 (warn)
	'no-constructor-return': 'warn',
	// global require 허용 (off)
	'global-require': 'off',
	// eslint-disable-next-line 허용 (off)
	'eslint-disable-next-line': 'off',
	// 중첩 삼항 연산자 경고 (warn)
	'no-nested-ternary': 'warn',
	// 일관된 return 권장 (off)
	'consistent-return': 'off',
	// 사용되지 않은 표현식 경고 (warn)
	'no-unused-expressions': 'warn',
	// debugger 경고 (warn)
	'no-debugger': 'warn',
	// alert 경고 (warn)
	'no-alert': 'warn',
	// === 사용 강제 (error)
	'eqeqeq': ['error', 'always'],
	// eval 금지 (error)
	'no-eval': 'error',
	// var 금지, let/const (error)
	'no-var': 'error',
	// 재할당 없으면 const (error)
	'prefer-const': 'error',
	// 화살표 함수 권장 (warn)
	'prefer-arrow-callback': 'warn',
	// 암묵적 타입 변환 (off) - !! 등 JS 관용 표현 허용, jsx-no-leaked-render와의 autofix 체인 회피
	'no-implicit-coercion': 'off',
	// 구조 분해 할당에 대한 컨벤션을 맞추면 일관적인 코드를 유지할 수 있어 가독성에 도움
	// 변수 선언식에서 객체에 대해서만 구조 분해 할당 규칙을 강제
	// ESLint의 --fix 옵션을 넣어서 실행하면 구조 분해 할당을 적용하는 코드로 자동 수정
	'prefer-destructuring': [
		'error',
		{
			VariableDeclarator: { array: false, object: true },
			AssignmentExpression: { array: false, object: false },
		},
	],
};

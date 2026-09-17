import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * rules/accessibility/a11y.js — 접근성(a11y) 규칙
 * 라인별: 규칙 설명 + (warn/error/off)
 */
export default {
	plugins: {
		'jsx-a11y': jsxA11y,
	},
	rules: {
		// img에 alt (의미 있거나 빈 문자열) (warn, img만)
		'jsx-a11y/alt-text': ['warn', { elements: ['img'] }],
		// 유효한 aria-* 속성만 사용 (warn)
		'jsx-a11y/aria-props': 'warn',
		// 유효한 aria-* 상태/값만 사용 (warn)
		'jsx-a11y/aria-proptypes': 'warn',
		// DOM에서 지원되는 role/ARIA만 사용 (warn)
		'jsx-a11y/aria-unsupported-elements': 'warn',
		// 필수 ARIA 속성 체크 (warn)
		'jsx-a11y/role-has-required-aria-props': 'warn',
		// ARIA는 지원 role에서만 (warn)
		'jsx-a11y/role-supports-aria-props': 'warn',
		// 컨트롤과 레이블 연결 (error)
		'jsx-a11y/control-has-associated-label': 'error',
		// 클릭 이벤트에 키 이벤트 연결 (error)
		'jsx-a11y/click-events-have-key-events': 'error',
		// 빈 제목 태그 금지 (error)
		'jsx-a11y/heading-has-content': 'error',
		// label과 input 연결 (error)
		'jsx-a11y/label-has-associated-control': 'error',
		// th에 scope 속성 (error)
		'jsx-a11y/scope': 'error',
		// 중복 role 제거 예: role="button" + button (warn)
		'jsx-a11y/no-redundant-roles': 'warn',
		// 비대화형 요소에 tabindex 제한 (warn)
		'jsx-a11y/no-noninteractive-tabindex': [
			'warn',
			{ tags: ['div', 'span', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th'] },
		],
	},
};

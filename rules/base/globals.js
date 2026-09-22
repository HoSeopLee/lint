import globals from 'globals';

/**
 * rules/base/globals.js
 *
 * ESLint languageOptions.globals용 전역 변수 세트.
 * preset별로 필요한 조합만 export.
 *
 * 사용처 확인:
 * - browserGlobals → presets/react (브라우저만)
 * - nodeGlobals → Node 전용 preset 확장 시
 * - browserNodeGlobals → presets/next (브라우저 + Node)
 */
export const browserGlobals = globals.browser;
export const nodeGlobals = globals.node;
export const browserNodeGlobals = { ...globals.browser, ...globals.node };

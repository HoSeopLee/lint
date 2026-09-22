import nextPlugin from '@next/eslint-plugin-next';

/**
 * rules/next/next.js — Next.js 전용 규칙 (configs/next.js 대응)
 * 라인별: 규칙 설명 + (warn/error/off)
 */
export default {
	plugins: {
		'@next/next': nextPlugin,
	},
	rules: {
		// <a> 대신 Link 사용 (error)
		'@next/next/no-html-link-for-pages': 'error',
		// <img> 대신 Image 권장 (warn)
		'@next/next/no-img-element': 'warn',
		// Polyfill.io 스크립트 금지 (error)
		'@next/next/no-unwanted-polyfillio': 'error',
		// 페이지별 커스텀 폰트 경고 (warn)
		'@next/next/no-page-custom-font': 'warn',
		// 동기 스크립트 금지 (error)
		'@next/next/no-sync-scripts': 'error',
		// Document head에 title 직접 사용 금지 (error)
		'@next/next/no-title-in-document-head': 'error',
		// Document에 CSS 태그 직접 사용 금지 (error)
		'@next/next/no-css-tags': 'error',
		// <head> 직접 사용 금지, next/head 사용 (error)
		'@next/next/no-head-element': 'error',
		// Document에서 next/head import 금지 (error)
		'@next/next/no-head-import-in-document': 'error',
		// head 내부 Script 컴포넌트 금지 (error)
		'@next/next/no-script-component-in-head': 'error',
		// Document에서 styled-jsx 금지 (error)
		'@next/next/no-styled-jsx-in-document': 'error',
		// Next API 이름 오타 검사 (warn)
		'@next/next/no-typos': 'warn',
		// 중복 Head 금지 (error)
		'@next/next/no-duplicate-head': 'error',
		// __webpack_require__ 등 모듈 변수 재할당 금지 (error)
		'@next/next/no-assign-module-variable': 'error',
		// Document 밖 beforeInteractive 스크립트 금지 (error)
		'@next/next/no-before-interactive-script-outside-document': 'error',
		// 페이지에서 Document import (off, 프로젝트별 설정)
		'@next/next/no-document-import-in-page': 'off',
		// Google Fonts에 display 속성 지정 (warn)
		'@next/next/google-font-display': 'warn',
		// Google Fonts에 preconnect 지정 (warn)
		'@next/next/google-font-preconnect': 'warn',
		// <Script> 컴포넌트에 id 필수 (warn)
		'@next/next/inline-script-id': 'warn',
		// GA는 next/script 사용 권장 (warn)
		'@next/next/next-script-for-ga': 'warn',
	},
};

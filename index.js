/**
 * 기본 진입점: React 프리셋 re-export
 * 확장 시 presets/base, presets/next, presets/full 또는 rules/* 조합 사용
 *
 * React/Next 및 기존 preset 공개 경로를 제공합니다.
 * @example
 * // React
 * import reactConfig from '@broccoil/lint/react';
 * // Next
 * import nextConfig from '@broccoil/lint/next';
 * // 프리셋 직접 사용
 * import basePreset from '@broccoil/lint/presets/base';
 * import fullPreset from '@broccoil/lint/presets/full';
 */
export { default } from './react.js';

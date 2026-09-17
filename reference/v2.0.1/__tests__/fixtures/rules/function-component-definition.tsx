// @expect-pass: @eslint-react/jsx-no-useless-fragment
// v1.0.4: 화살표 함수 + 함수 선언문 둘 다 허용 (기존엔 화살표만 허용)
import React from 'react';

interface Props {
	title: string;
}

// ✅ 화살표 함수 (v1.0.3 이전부터 허용)
export const ArrowComponent = ({ title }: Props) => {
	return <h1>{title}</h1>;
};

// ✅ 함수 선언문 (v1.0.4부터 허용) — Next.js page.tsx/layout.tsx 패턴
export default function DeclaredComponent({ title }: Props) {
	return <h2>{title}</h2>;
}

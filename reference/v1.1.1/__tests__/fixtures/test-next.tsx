// Next.js 설정 테스트용 샘플 파일
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Next.js 규칙 테스트
const TestNextPage = () => {
	// <a> 태그 대신 Link 사용 테스트
	const badLink = <a href="/about">About</a>; // 에러가 나야 함

	// <img> 태그 대신 Image 사용 테스트
	const badImage = <img src="/logo.png" alt="logo" />; // 경고가 나야 함

	// console 사용 테스트 (off로 설정되어 있어야 함)
	console.log('Next.js test');

	// === 사용 테스트
	const value = 1;
	if (value == 1) {
		// 이건 에러가 나야 함
	}

	// var 사용 테스트
	var oldVar = 'test'; // 이건 에러가 나야 함

	return (
		<div>
			<Link href="/about">About</Link>
			<Image src="/logo.png" alt="logo" width={100} height={100} />
		</div>
	);
};

export default TestNextPage;


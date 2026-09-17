import React from 'react';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Header } from './Header';

// 좋은 예시: 올바른 import 순서, 사용된 변수, 올바른 React 패턴
export const GoodComponent = () => {
	const [count, setCount] = useState(0);

	const handleClick = () => {
		setCount(count + 1);
	};

	return (
		<div>
			<Header />
			<Button onClick={handleClick}>Count: {count}</Button>
		</div>
	);
};


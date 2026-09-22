import { useState } from 'react';
import React from 'react';

import { Header } from './Header';
import { Button } from '@/components/Button';

// 나쁜 예시: 잘못된 import 순서, 미사용 import, 잘못된 React 패턴
import { unused } from './unused';

export const BadComponent = () => {
	const [count, setCount] = useState(0);

	const handleClick = () => {
		// 나쁜 예시: == 사용, var 사용
		if (count == 0) {
			var bad = true;
		}

		// 나쁜 예시: 직접 state 변경
		count = count + 1;
	};

	return (
		<div>
			{/* 나쁜 예시: key 없음, alt 없음 */}
			<img src="test.jpg" />
			{count.map((item) => (
				<div>{item}</div>
			))}
		</div>
	);
};


// simple-import-sort 테스트용: import 순서만 의도적으로 잘못됨
import { Header } from './Header';
import React from 'react';
import { useState } from 'react';

export const ImportOrderTest = () => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<Header />
			<button onClick={() => setCount(count + 1)}>{count}</button>
		</div>
	);
};

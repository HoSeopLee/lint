// @expect-rule: @eslint-react/no-unstable-context-value
// v1.0.4: Context Provider에 인라인 객체/배열 전달 방지 (불필요한 re-render)
import React, { createContext } from 'react';

interface User {
	name: string;
	role: string;
}

const UserContext = createContext<{ user: User; update: () => void } | null>(null);

interface Props {
	user: User;
	children: React.ReactNode;
}

export const Provider = ({ user, children }: Props) => {
	const update = () => {};
	return (
		// ❌ 매 렌더마다 새 객체 생성 → 모든 소비자 re-render
		<UserContext.Provider value={{ user, update }}>{children}</UserContext.Provider>
	);
};

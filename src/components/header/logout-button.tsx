'use client';

import { signOut } from '@/lib/auth';

import { Button } from '@/components/ui/button';

/** 로그아웃 버튼 컴포넌트 */
const HeaderLogoutButton = () => {
	return (
		<Button variant="ghost" size="sm" onClick={signOut}>
			로그아웃
		</Button>
	);
};

export default HeaderLogoutButton;

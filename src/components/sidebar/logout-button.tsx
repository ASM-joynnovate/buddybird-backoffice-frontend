'use client';

import { signOut } from '@/lib/auth';

import { LogOut } from 'lucide-react';

/** 로그아웃 버튼 컴포넌트 */
const SidebarLogoutButton = () => {
	return (
		<button
			type="button"
			className="flex h-9.5 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
			onClick={signOut}
		>
			<LogOut className="size-4.5" />
			로그아웃
		</button>
	);
};

export default SidebarLogoutButton;

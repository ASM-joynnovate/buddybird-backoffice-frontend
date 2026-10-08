'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import type { Theme } from '@/types/theme';

import { cn } from '@/lib/utils';

import SidebarLogoutButton from '@/components/sidebar/logout-button';
import SidebarMenu from '@/components/sidebar/menu';
import SidebarThemeSelect from '@/components/sidebar/theme-select';

interface Props {
	theme?: Theme;
}

/**
 * 백오피스 사이드바 컴포넌트
 * @param theme 쿠키에 저장된 화면 모드
 */
const Sidebar = ({ theme }: Props) => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<aside className="flex shrink-0 flex-col gap-3 border-b border-sidebar-border bg-sidebar p-3 text-sidebar-foreground md:sticky md:top-0 md:h-dvh md:w-58 md:border-r md:border-b-0 md:py-5">
			<div className="flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2 px-2 font-bold">
					<Image src="/images/mascot.svg" alt="" width={28} height={28} />
					버디버드
					<span className="text-xs font-medium text-sidebar-foreground/65">백오피스</span>
				</Link>

				<button
					type="button"
					aria-expanded={menuOpen}
					className="h-9 rounded-lg border border-sidebar-border px-3 text-sm font-bold md:hidden"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					메뉴
				</button>
			</div>

			{/*좁은 화면에서는 메뉴 버튼으로 펼침*/}
			<div className={cn('flex-1 flex-col gap-3 md:flex', menuOpen ? 'flex' : 'hidden')}>
				<SidebarMenu onSelect={() => setMenuOpen(false)} />

				<div className="mt-auto flex flex-col gap-1">
					<SidebarThemeSelect theme={theme} />
					<SidebarLogoutButton />
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;

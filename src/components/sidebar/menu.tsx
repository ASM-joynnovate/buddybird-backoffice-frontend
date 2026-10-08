'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import {
	Bell,
	FileText,
	House,
	Megaphone,
	MessageSquare,
	Music,
	PanelTop,
	Smartphone,
	UserRound,
	UserRoundX,
} from 'lucide-react';

const menuGroups = [
	[
		{ href: '/', label: '홈', icon: House },
		{ href: '/users', label: '사용자', icon: UserRound },
		{ href: '/feedback', label: '피드백', icon: MessageSquare },
		{ href: '/withdrawals', label: '탈퇴', icon: UserRoundX },
	],
	[
		{ href: '/announcements', label: '공지', icon: Megaphone },
		{ href: '/notifications', label: '알림', icon: Bell },
		{ href: '/app-updates', label: '앱 업데이트', icon: Smartphone },
		{ href: '/consents', label: '고지문', icon: FileText },
		{ href: '/preset-words', label: '단어 프리셋', icon: Music },
	],
	[{ href: '/legacy', label: '기존 화면', icon: PanelTop }],
];

interface Props {
	onSelect: () => void;
}

/**
 * 사이드바 메뉴 목록 컴포넌트
 * @param onSelect 메뉴를 고르면 실행할 함수
 */
const SidebarMenu = ({ onSelect }: Props) => {
	const pathname = usePathname();

	return (
		<nav aria-label="메뉴" className="flex flex-col gap-2">
			{menuGroups.map((menuGroup) => (
				<div
					key={menuGroup[0].href}
					className="flex flex-col gap-0.5 border-sidebar-border not-first:border-t not-first:pt-2"
				>
					{menuGroup.map((menu) => {
						const selected = menu.href === '/' ? pathname === '/' : pathname.startsWith(menu.href);

						return (
							<Link
								key={menu.href}
								href={menu.href}
								aria-current={selected ? 'page' : undefined}
								className={cn(
									'flex h-9.5 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground',
									selected && 'bg-sidebar-accent font-bold text-sidebar-foreground',
								)}
								onClick={onSelect}
							>
								<menu.icon className="size-4.5" />
								{menu.label}
							</Link>
						);
					})}
				</div>
			))}
		</nav>
	);
};

export default SidebarMenu;

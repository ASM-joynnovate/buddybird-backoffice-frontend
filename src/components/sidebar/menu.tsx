'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import {
	Bell,
	BellPlus,
	ChartNoAxesColumn,
	FileText,
	House,
	Megaphone,
	MessageSquare,
	Music,
	PanelTop,
	Siren,
	Smartphone,
	UserRound,
	UserRoundX,
} from 'lucide-react';

const menuGroups = [
	{
		menus: [
			{ href: '/', label: '홈', icon: House },
			{ href: '/analytics', label: '분석', icon: ChartNoAxesColumn },
		],
	},
	{
		title: '사용자',
		menus: [
			{ href: '/users', label: '사용자', icon: UserRound },
			{ href: '/emergencies', label: '응급 상황', icon: Siren },
			{ href: '/feedback', label: '피드백', icon: MessageSquare },
			{ href: '/withdrawals', label: '탈퇴', icon: UserRoundX },
		],
	},
	{
		title: '알림',
		menus: [
			{ href: '/notifications', label: '알림 발송', icon: Bell },
			{ href: '/notification-settings', label: '알림 설정', icon: BellPlus },
		],
	},
	{
		title: '등록',
		menus: [
			{ href: '/announcements', label: '공지', icon: Megaphone },
			{ href: '/consents', label: '고지문', icon: FileText },
			{ href: '/app-updates', label: '앱 업데이트', icon: Smartphone },
			{ href: '/preset-words', label: '단어 프리셋', icon: Music },
		],
	},
	{ menus: [{ href: '/legacy', label: '기존 화면', icon: PanelTop }] },
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
		<nav
			aria-label="메뉴"
			className="-mx-1 flex min-h-0 [scrollbar-color:rgb(255_255_255/18%)_transparent] flex-col gap-4 overflow-y-auto px-1 max-md:gap-3 max-md:overflow-visible"
		>
			{menuGroups.map((menuGroup) => (
				<div
					key={menuGroup.menus[0].href}
					// 기존 화면 위에만 구분선
					className="flex flex-col gap-0.5 border-sidebar-border last:border-t last:pt-2"
				>
					{menuGroup.title && (
						<h2 className="flex h-6 items-center px-2.5 text-xs font-semibold text-sidebar-foreground/50">
							{menuGroup.title}
						</h2>
					)}

					{/*좁은 화면에서는 두 열*/}
					<div className="flex flex-col gap-0.5 max-md:grid max-md:grid-cols-2 max-md:gap-1">
						{menuGroup.menus.map((menu) => {
							const selected = menu.href === '/' ? pathname === '/' : pathname.startsWith(menu.href);

							return (
								<Link
									key={menu.href}
									href={menu.href}
									aria-current={selected ? 'page' : undefined}
									className={cn(
										'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground max-md:h-11',
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
				</div>
			))}
		</nav>
	);
};

export default SidebarMenu;

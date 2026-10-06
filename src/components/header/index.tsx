import Link from 'next/link';

import HeaderLogoutButton from '@/components/header/logout-button';

const menus = [
	{ href: '/users', label: '사용자' },
	{ href: '/announcements', label: '공지' },
	{ href: '/consents', label: '고지문' },
	{ href: '/app-updates', label: '앱 업데이트' },
	{ href: '/notifications', label: '알림' },
	{ href: '/preset-words', label: '단어 프리셋' },
	{ href: '/feedback', label: '피드백' },
	{ href: '/withdrawals', label: '탈퇴' },
	{ href: '/legacy', label: '기존 화면' },
];

/** 백오피스 헤더 컴포넌트 */
const Header = () => {
	return (
		<header className="border-b px-6 py-3">
			<nav className="flex items-center justify-between">
				<div className="flex items-center gap-6">
					<Link href="/users" className="text-lg font-bold">
						버디버드 백오피스
					</Link>

					<div className="flex items-center gap-4 text-sm">
						{menus.map((menu) => (
							<Link
								key={menu.href}
								href={menu.href}
								className="text-muted-foreground hover:text-foreground"
							>
								{menu.label}
							</Link>
						))}
					</div>
				</div>

				<HeaderLogoutButton />
			</nav>
		</header>
	);
};

export default Header;

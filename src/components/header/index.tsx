import Link from 'next/link';

import LogoutButton from '@/components/header/logout-button';

export default function Header() {
	return (
		<header className="border-b px-6 py-3">
			<nav className="flex items-center justify-between">
				<div className="flex items-center gap-6">
					<Link href="/captures" className="text-lg font-bold">
						버디버드 백오피스
					</Link>
					<div className="flex items-center gap-4 text-sm">
						<Link href="/captures" className="text-muted-foreground hover:text-foreground">
							캡처
						</Link>
						<Link href="/labels" className="text-muted-foreground hover:text-foreground">
							라벨 관리
						</Link>
					</div>
				</div>
				<LogoutButton />
			</nav>
		</header>
	);
}

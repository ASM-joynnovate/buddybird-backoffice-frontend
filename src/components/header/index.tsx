import Link from 'next/link';

import LogoutButton from '@/components/header/logout-button';

export default function Header() {
	return (
		<header className="border-b px-6 py-3">
			<nav className="flex items-center justify-between">
				<Link href="/captures" className="text-lg font-bold">
					버디버드 백오피스
				</Link>
				<LogoutButton />
			</nav>
		</header>
	);
}

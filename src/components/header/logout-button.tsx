'use client';

import { useRouter } from 'next/navigation';

import { clearPassword } from '@/lib/auth';

import { Button } from '@/components/ui/button';

export default function LogoutButton() {
	const router = useRouter();

	const handleLogout = () => {
		clearPassword();
		router.push('/login');
	};

	return (
		<Button variant="ghost" size="sm" onClick={handleLogout}>
			로그아웃
		</Button>
	);
}

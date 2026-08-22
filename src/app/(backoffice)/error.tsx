'use client';

import { useRouter } from 'next/navigation';

import { clearPassword } from '@/lib/auth';

import { Button } from '@/components/ui/button';

interface Props {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function Error({ error, reset }: Props) {
	const router = useRouter();

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4">
			<h2>{error.message}</h2>
			<div className="flex gap-2">
				<Button variant="outline" onClick={() => reset()}>
					재시도
				</Button>
				<Button
					onClick={() => {
						clearPassword();
						router.push('/login');
					}}
				>
					로그인
				</Button>
			</div>
		</div>
	);
}

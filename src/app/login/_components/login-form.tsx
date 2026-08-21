'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { setPassword } from '@/lib/auth';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
	const router = useRouter();
	const [password, setPasswordValue] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!password.trim()) {
			toast.error('비밀번호를 입력해 주세요.');
			return;
		}

		setPassword(password.trim());
		router.push('/captures');
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
			<h1 className="text-2xl font-bold">버디버드 백오피스</h1>
			<div className="space-y-2">
				<Label htmlFor="password">비밀번호</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPasswordValue(e.target.value)}
					placeholder="백오피스 비밀번호를 입력하세요"
					autoFocus
				/>
			</div>
			<Button type="submit" className="w-full">
				로그인
			</Button>
		</form>
	);
}

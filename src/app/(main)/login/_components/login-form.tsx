'use client';

import { type SubmitEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ApiError } from '@/types/apis/common';

import { useLogin } from '@/hooks/apis/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** 로그인 폼 컴포넌트 */
const LoginForm = () => {
	const router = useRouter();

	const [password, setPassword] = useState('');

	const { error, isPending, isSuccess, mutate } = useLogin();

	const passwordRejected = error instanceof ApiError && error.passwordRejected;

	const handleLogin = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isPending || isSuccess) {
			return;
		}

		mutate({ password }, { onSuccess: () => router.replace('/users') });
	};

	return (
		<form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
			<h1 className="text-2xl font-bold">버디버드 백오피스</h1>

			<div className="space-y-2">
				<Label htmlFor="password">비밀번호</Label>
				<Input
					id="password"
					type="password"
					autoComplete="current-password"
					required
					value={password}
					aria-invalid={passwordRejected}
					onChange={(event) => setPassword(event.target.value)}
				/>
				{passwordRejected && (
					<p role="alert" className="text-sm text-destructive">
						{error.message}
					</p>
				)}
			</div>

			<Button type="submit" disabled={isPending || isSuccess} className="w-full">
				로그인
			</Button>
		</form>
	);
};

export default LoginForm;

'use client';

import { type ReactNode, useEffect } from 'react';

import { signOut } from '@/lib/auth';
import { setUnauthorizedHandler } from '@/lib/query-client';

interface Props {
	children: ReactNode;
}

/**
 * 비밀번호 오류 응답을 처리하는 provider
 * @param children 감싸는 내용
 */
const AuthProvider = ({ children }: Props) => {
	/** 비밀번호 오류 응답을 받으면 로그아웃 */
	useEffect(() => {
		setUnauthorizedHandler(signOut);
	}, []);

	return children;
};

export default AuthProvider;

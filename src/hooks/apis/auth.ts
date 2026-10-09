import { useMutation } from '@tanstack/react-query';

import { checkPassword } from '@/apis/auth';

import { ApiError } from '@/types/apis/common';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';
import { savePassword } from '@/lib/auth';

import { toast } from 'sonner';

/** 로그인 Hook */
export const useLogin = () => {
	return useMutation({
		mutationKey: apiKeys.mutation('auth', 'login'),
		mutationFn: checkPassword,
		meta: { skipUnauthorizedSignOut: true },
		onSuccess: (_data, { password }) => savePassword(password),
		onError: (error) => {
			if (!(error instanceof ApiError && error.passwordRejected)) {
				toast.error(apiErrorMessage(error));
			}
		},
	});
};

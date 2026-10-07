'use client';

import { apiErrorMessage } from '@/lib/api';

import { Button } from '@/components/ui/button';

interface Props {
	error: Error;
	onRetry: () => void;
}

/**
 * 조회 실패 시 표시되는 컴포넌트
 * @param error 발생한 오류
 * @param onRetry 다시 시도할 때 실행할 함수
 */
const QueryError = ({ error, onRetry }: Props) => {
	return (
		<div role="alert" className="flex flex-col items-center justify-center gap-4 py-8">
			<p>{apiErrorMessage(error)}</p>

			<Button variant="outline" onClick={onRetry}>
				다시 시도
			</Button>
		</div>
	);
};

export default QueryError;

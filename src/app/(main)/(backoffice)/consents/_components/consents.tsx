'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import ConsentCards from '@/app/(main)/(backoffice)/consents/_components/consent-cards';
import ConsentCardsSkeleton from '@/app/(main)/(backoffice)/consents/_components/consent-cards-skeleton';
import type { ConsentFormMode } from '@/app/(main)/(backoffice)/consents/_components/consent-form';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';

interface Props {
	kind?: string;
	version?: string;
	today: string;
	now: number;
}

/**
 * 고지문 화면 컴포넌트
 * @param kind 주소에서 고른 종류
 * @param version 주소에서 고른 버전
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Consents = ({ kind, version, today, now }: Props) => {
	const [formMode, setFormMode] = useState<ConsentFormMode | null>(null);

	return (
		<>
			<div className="flex items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">고지문</h1>

				<Button disabled={formMode === 'newConsent'} onClick={() => setFormMode('newConsent')}>
					<Plus />
					새 고지문
				</Button>
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ConsentCardsSkeleton />>
				<ConsentCards
					kind={kind}
					version={version}
					formMode={formMode}
					today={today}
					initialNow={now}
					onFormModeChange={setFormMode}
				/>
			</ErrorHandlingWrapper>
		</>
	);
};

export default Consents;

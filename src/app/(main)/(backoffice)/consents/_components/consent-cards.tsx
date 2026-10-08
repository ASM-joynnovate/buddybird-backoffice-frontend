'use client';

import { useGetConsentList } from '@/hooks/apis/consents';
import { useNow } from '@/hooks/use-now';

import { Plus } from 'lucide-react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import ConsentDetailCard from '@/app/(main)/(backoffice)/consents/_components/consent-detail-card';
import ConsentForm, { type ConsentFormMode } from '@/app/(main)/(backoffice)/consents/_components/consent-form';
import ConsentKindCard from '@/app/(main)/(backoffice)/consents/_components/consent-kind-card';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
	kind?: string;
	version?: string;
	formMode: ConsentFormMode | null;
	today: string;
	initialNow: number;
	onFormModeChange: (formMode: ConsentFormMode | null) => void;
}

/**
 * 종류 카드 및 고른 종류의 상세 카드 컴포넌트
 * @param kind 주소에서 고른 종류
 * @param version 주소에서 고른 버전
 * @param formMode 열려 있는 입력 폼
 * @param today 오늘 날짜
 * @param initialNow 서버가 화면을 그린 시각
 * @param onFormModeChange 입력 폼을 열거나 닫을 때 실행할 함수
 */
const ConsentCards = ({ kind, version, formMode, today, initialNow, onFormModeChange }: Props) => {
	const { data: consentListData } = useGetConsentList();

	const now = useNow(initialNow);

	const consentsByKind = Map.groupBy(consentListData, (consent) => consent.kind);
	// 목록에 없는 종류면 첫 종류
	const selectedKind = kind && consentsByKind.has(kind) ? kind : consentListData[0]?.kind;

	if (consentListData.length === 0 && formMode !== 'newConsent') {
		return (
			<Card className="items-center gap-2.5 px-4 pt-10 pb-8 text-center">
				<p className="text-base font-bold">등록된 고지문이 없습니다</p>
				<p className="max-w-[44ch] text-muted-foreground">
					고지문을 등록하면 게시 일시부터 앱의 약관 동의 화면에 표시됩니다.
				</p>
				<Button className="mt-1.5" onClick={() => onFormModeChange('newConsent')}>
					<Plus />
					새 고지문
				</Button>
			</Card>
		);
	}

	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
			<ConsentKindCard
				consentsByKind={consentsByKind}
				selectedKind={selectedKind}
				newConsentWriting={formMode === 'newConsent'}
				now={now}
				onKindSelect={() => onFormModeChange(null)}
			/>

			{formMode === 'newConsent' || !selectedKind ? (
				<TitledCard title="새 고지문">
					<ConsentForm
						formMode="newConsent"
						liveConsentExists={false}
						onClose={() => onFormModeChange(null)}
					/>
				</TitledCard>
			) : (
				<ConsentDetailCard
					kindConsents={consentsByKind.get(selectedKind) ?? []}
					version={version}
					formMode={formMode}
					today={today}
					now={now}
					onFormModeChange={onFormModeChange}
				/>
			)}
		</div>
	);
};

export default ConsentCards;

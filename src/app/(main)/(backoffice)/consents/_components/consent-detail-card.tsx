'use client';

import { useState } from 'react';

import type { Consent } from '@/types/apis/consents';

import type { I18nFieldValue } from '@/types/i18n';

import { Plus } from 'lucide-react';

import ConsentForm, { type ConsentFormMode } from '@/app/(main)/(backoffice)/consents/_components/consent-form';
import ConsentVersionDetail from '@/app/(main)/(backoffice)/consents/_components/consent-version-detail';
import ConsentVersionStrip from '@/app/(main)/(backoffice)/consents/_components/consent-version-strip';
import { findLiveConsent } from '@/utils/consent';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
	kindConsents: Consent[];
	version?: string;
	formMode: ConsentFormMode | null;
	today: string;
	now: number;
	onFormModeChange: (formMode: ConsentFormMode | null) => void;
}

/**
 * 고른 종류의 버전 및 전문 카드 컴포넌트
 * @param kindConsents 고른 종류의 버전 목록
 * @param version 주소에서 고른 버전
 * @param formMode 열려 있는 입력 폼
 * @param today 오늘 날짜
 * @param now 현재 시각
 * @param onFormModeChange 입력 폼을 열거나 닫을 때 실행할 함수
 */
const ConsentDetailCard = ({ kindConsents, version, formMode, today, now, onFormModeChange }: Props) => {
	const [locale, setLocale] = useState<keyof I18nFieldValue>('ko_kr');
	const [compared, setCompared] = useState(false);

	const liveConsent = findLiveConsent(kindConsents, now);
	const shownConsent = liveConsent ?? kindConsents[0];
	// 목록에 없는 버전이면 대표하는 버전
	const selectedConsent = kindConsents.find((consent) => String(consent.version) === version) ?? shownConsent;

	return (
		<Card className="gap-3.5 py-4.5">
			<CardHeader className="gap-0 px-5">
				<CardTitle className="font-bold">{koreanOrEnglishText(shownConsent.title)}</CardTitle>
				<CardDescription className="text-[13px]">{shownConsent.kind}</CardDescription>

				<CardAction>
					<Button variant="outline" disabled={!!formMode} onClick={() => onFormModeChange('newVersion')}>
						<Plus />
						새 버전
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent className="px-5">
				{/*종류가 바뀌면 다시 마운트*/}
				<ConsentVersionStrip
					key={shownConsent.kind}
					kindConsents={kindConsents}
					liveConsent={liveConsent}
					selectedConsent={formMode === 'newVersion' ? undefined : selectedConsent}
					newVersionWriting={formMode === 'newVersion'}
					now={now}
					onVersionSelect={() => onFormModeChange(null)}
				/>

				<hr className="-mx-5 my-4.5" />

				{formMode ? (
					<ConsentForm
						formMode={formMode}
						sourceConsent={formMode === 'edit' ? selectedConsent : kindConsents[0]}
						liveConsentExists={!!liveConsent}
						onClose={() => onFormModeChange(null)}
					/>
				) : (
					<ConsentVersionDetail
						consent={selectedConsent}
						kindConsents={kindConsents}
						liveConsent={liveConsent}
						locale={locale}
						compared={compared}
						today={today}
						now={now}
						onLocaleChange={setLocale}
						onComparedChange={setCompared}
						onEdit={() => onFormModeChange('edit')}
					/>
				)}
			</CardContent>
		</Card>
	);
};

export default ConsentDetailCard;

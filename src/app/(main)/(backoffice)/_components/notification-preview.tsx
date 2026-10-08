'use client';

import { useState } from 'react';

import type { I18nText } from '@/types/apis/common';
import type { NotificationKind } from '@/types/apis/notifications';

import PushPreviewCard from '@/app/(main)/(backoffice)/_components/push-preview-card';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { UNSUBSCRIBE_TEXTS } from '@/config/notification';

const PREVIEW_LOCALES = [
	{ locale: 'ko_kr', label: '한국어' },
	{ locale: 'en_us', label: '영어' },
] satisfies { locale: keyof I18nText; label: string }[];

interface Props {
	kind: NotificationKind;
	title: I18nText;
	body: I18nText;
	imageUrl?: string | null;
}

/**
 * 고른 언어의 푸시 알림 미리보기 컴포넌트
 * @param kind 알림 종류
 * @param title 표시할 제목
 * @param body 표시할 본문
 * @param imageUrl 알림 사진의 주소
 */
const NotificationPreview = ({ kind, title, body, imageUrl }: Props) => {
	const [previewLocale, setPreviewLocale] = useState<keyof I18nText>('ko_kr');

	// 한국어가 비어 있으면 영어 문구 발송
	const textLocale = previewLocale === 'ko_kr' && body.ko_kr !== null ? 'ko_kr' : 'en_us';
	const previewTitle = (previewLocale === 'ko_kr' ? title.ko_kr : null) ?? title.en_us;

	return (
		<section className="grid gap-2.5">
			<div className="flex min-h-7 items-center justify-between gap-3">
				<h4 className="text-[13px] font-semibold">미리보기</h4>

				<SegmentedControl
					label="미리보기 언어"
					size="sm"
					options={PREVIEW_LOCALES.map(({ locale, label }) => ({ value: locale, label }))}
					value={previewLocale}
					className="border-border"
					onValueChange={setPreviewLocale}
				/>
			</div>

			{/*마케팅 알림은 본문 아래에 수신거부 문구 발송*/}
			<PushPreviewCard
				title={previewTitle}
				body={body[textLocale] ?? ''}
				bodySuffix={kind === 'marketing' ? `\n${UNSUBSCRIBE_TEXTS[textLocale]}` : undefined}
				imageUrl={imageUrl}
			/>
		</section>
	);
};

export default NotificationPreview;

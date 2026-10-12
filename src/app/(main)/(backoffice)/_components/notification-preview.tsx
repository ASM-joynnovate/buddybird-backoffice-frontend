'use client';

import { useState } from 'react';

import type { I18nText } from '@/types/apis/common';
import type { NotificationKind } from '@/types/apis/notifications';

import PushPreviewCard from '@/app/(main)/(backoffice)/_components/push-preview-card';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { I18N_LOCALES } from '@/config/locale';
import { UNSUBSCRIBE_TEXTS } from '@/config/notification';
import { toI18nLocaleName } from '@/utils/i18n-text';

interface Props {
	kind: NotificationKind;
	title: I18nText;
	body: I18nText;
	imageUrl?: string | null;
	locale?: keyof I18nText;
}

/**
 * 선택한 언어의 푸시 알림 미리보기 컴포넌트
 * @param kind 알림 종류
 * @param title 표시할 제목
 * @param body 표시할 본문
 * @param imageUrl 알림 사진의 주소
 * @param locale 입력 폼에서 선택한 언어
 */
const NotificationPreview = ({ kind, title, body, imageUrl, locale }: Props) => {
	const [selectedLocale, setSelectedLocale] = useState<keyof I18nText>('ko_kr');

	const previewLocale = locale ?? selectedLocale;
	// 본문이 비어 있는 언어는 영어 문구 발송
	const textLocale = body[previewLocale] === null ? 'en_us' : previewLocale;
	const previewTitle = title[previewLocale] ?? title.en_us;

	return (
		<section className="grid gap-2.5">
			<div className="flex min-h-7 items-center justify-between gap-3">
				<h4 className="text-[13px] font-semibold">미리보기</h4>

				{/*입력 폼에서는 폼의 언어 목록으로 선택*/}
				{locale ? (
					<p className="text-[13px] text-muted-foreground">{toI18nLocaleName(locale)}</p>
				) : (
					<SegmentedControl
						label="미리보기 언어"
						size="sm"
						options={I18N_LOCALES.map((localeOption) => ({
							value: localeOption.locale,
							label: localeOption.label,
						}))}
						value={selectedLocale}
						className="border-border"
						onValueChange={setSelectedLocale}
					/>
				)}
			</div>

			{/*마케팅 알림은 본문 아래에 수신거부 문구 발송*/}
			<PushPreviewCard
				locale={previewLocale}
				title={previewTitle}
				body={body[textLocale] ?? ''}
				bodySuffix={kind === 'marketing' ? `\n${UNSUBSCRIBE_TEXTS[textLocale]}` : undefined}
				imageUrl={imageUrl}
			/>
		</section>
	);
};

export default NotificationPreview;

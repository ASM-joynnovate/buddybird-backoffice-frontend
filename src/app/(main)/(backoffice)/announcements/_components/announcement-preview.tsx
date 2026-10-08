import Image from 'next/image';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import AppDialogPreview from '@/app/(main)/(backoffice)/_components/app-dialog-preview';
import PushPreviewCard from '@/app/(main)/(backoffice)/_components/push-preview-card';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';

const PREVIEW_LOCALES = [
	{ locale: 'ko_kr', label: '한국어', closeLabel: '닫기', detailLabel: '자세히' },
	{ locale: 'en_us', label: '영어', closeLabel: 'CLOSE', detailLabel: 'DETAILS' },
] satisfies { locale: keyof I18nFieldValue; label: string; closeLabel: string; detailLabel: string }[];

interface Props {
	title: I18nFieldValue;
	body: I18nFieldValue;
	imageUrl?: string;
	pushEnabled: boolean;
	locale: keyof I18nFieldValue;
	onLocaleChange: (locale: keyof I18nFieldValue) => void;
}

/**
 * 앱 및 수신 기기에 표시되는 공지의 미리보기 컴포넌트
 * @param title 제목 입력값
 * @param body 본문 입력값
 * @param imageUrl 첫 번째 사진의 주소
 * @param pushEnabled 푸시 발송 여부
 * @param locale 미리보기에 표시할 언어
 * @param onLocaleChange 언어를 고르면 실행할 함수
 */
const AnnouncementPreview = ({ title, body, imageUrl, pushEnabled, locale, onLocaleChange }: Props) => {
	const previewLocale = PREVIEW_LOCALES.find((localeOption) => localeOption.locale === locale) ?? PREVIEW_LOCALES[0];

	// 한국어가 비어 있으면 영어 문구 표시
	const previewTitle = title[locale].trim() || title.en_us.trim();
	const previewBody = body[locale].trim() || body.en_us.trim();

	return (
		<aside className="grid content-start gap-3.5 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-bold">미리보기</h3>

				<SegmentedControl
					label="미리보기 언어"
					size="sm"
					options={PREVIEW_LOCALES.map((localeOption) => ({
						value: localeOption.locale,
						label: localeOption.label,
					}))}
					value={locale}
					className="border-border"
					onValueChange={onLocaleChange}
				/>
			</div>

			<section className="grid gap-1.5">
				<h4 className="text-[13px] font-semibold text-muted-foreground">앱 팝업</h4>

				<AppDialogPreview
					label="앱 홈 화면에 표시되는 공지 팝업"
					title={
						<span className={cn(!previewTitle && 'font-normal text-[#777]')}>{previewTitle || '제목'}</span>
					}
					closeLabel={previewLocale.closeLabel}
					acceptLabel={previewLocale.detailLabel}
				>
					<div className="grid gap-3">
						{!!imageUrl && (
							<Image
								src={imageUrl}
								alt=""
								width={340}
								height={191}
								unoptimized
								className="aspect-video w-full rounded-[16px] bg-[#f7f7f7] object-cover"
							/>
						)}

						<p
							className={cn(
								'line-clamp-4 text-[15px] leading-[1.4] font-bold wrap-anywhere whitespace-pre-line',
								!previewBody && 'font-normal text-[#777]',
							)}
						>
							{previewBody || '본문'}
						</p>
					</div>
				</AppDialogPreview>
			</section>

			{pushEnabled && (
				<section className="grid gap-1.5">
					<h4 className="text-[13px] font-semibold text-muted-foreground">푸시 알림</h4>

					<PushPreviewCard title={previewTitle} body={previewBody} imageUrl={imageUrl} />
				</section>
			)}
		</aside>
	);
};

export default AnnouncementPreview;

import Image from 'next/image';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import AppDialogPreview from '@/app/(main)/(backoffice)/_components/app-dialog-preview';
import PushPreviewCard from '@/app/(main)/(backoffice)/_components/push-preview-card';
import { toI18nLocaleName } from '@/utils/i18n-text';

// 문구는 앱의 공지 팝업과 같음
const POPUP_TEXTS = {
	ko_kr: { closeLabel: '닫기', detailLabel: '자세히' },
	en_us: { closeLabel: 'CLOSE', detailLabel: 'DETAILS' },
	ja_jp: { closeLabel: '閉じる', detailLabel: '詳しく見る' },
	ru_ru: { closeLabel: 'ЗАКРЫТЬ', detailLabel: 'ПОДРОБНЕЕ' },
	es_es: { closeLabel: 'CERRAR', detailLabel: 'VER MÁS' },
	zh_cn: { closeLabel: '关闭', detailLabel: '详情' },
	zh_tw: { closeLabel: '關閉', detailLabel: '查看詳情' },
	th_th: { closeLabel: 'ปิด', detailLabel: 'ดูรายละเอียด' },
} satisfies Record<keyof I18nFieldValue, { closeLabel: string; detailLabel: string }>;

interface Props {
	title: I18nFieldValue;
	body: I18nFieldValue;
	imageUrl?: string;
	pushEnabled: boolean;
	locale: keyof I18nFieldValue;
}

/**
 * 앱 및 수신 기기에 표시되는 공지의 미리보기 컴포넌트
 * @param title 제목 입력값
 * @param body 본문 입력값
 * @param imageUrl 첫 번째 사진의 주소
 * @param pushEnabled 푸시 발송 여부
 * @param locale 미리보기에 표시할 언어
 */
const AnnouncementPreview = ({ title, body, imageUrl, pushEnabled, locale }: Props) => {
	// 선택한 언어가 비어 있으면 영어 문구 표시
	const previewTitle = title[locale].trim() || title.en_us.trim();
	const previewBody = body[locale].trim() || body.en_us.trim();

	return (
		<aside className="grid content-start gap-3.5 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
			<div className="flex min-h-7 items-center justify-between gap-2">
				<h3 className="text-base font-bold">미리보기</h3>
				<p className="text-[13px] text-muted-foreground">{toI18nLocaleName(locale)}</p>
			</div>

			<section className="grid gap-1.5">
				<h4 className="text-[13px] font-semibold text-muted-foreground">앱 팝업</h4>

				<AppDialogPreview
					label="앱 홈 화면에 표시되는 공지 팝업"
					title={
						<span className={cn(!previewTitle && 'font-normal text-[#777]')}>{previewTitle || '제목'}</span>
					}
					closeLabel={POPUP_TEXTS[locale].closeLabel}
					acceptLabel={POPUP_TEXTS[locale].detailLabel}
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

					<PushPreviewCard locale={locale} title={previewTitle} body={previewBody} imageUrl={imageUrl} />
				</section>
			)}
		</aside>
	);
};

export default AnnouncementPreview;

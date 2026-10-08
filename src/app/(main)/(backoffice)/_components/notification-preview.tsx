import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { NotificationContent } from '@/app/(main)/(backoffice)/_components/notification-content-fields';

const MARKETING_TITLE_PREFIX = '(광고) ';
const MARKETING_BODY_PREFIX = '(광고)';
const KOREAN_UNSUBSCRIBE_TEXT = '무료 수신거부: 프로필 > 설정 > 알림에서 마케팅 알림 Off';
const ENGLISH_UNSUBSCRIBE_TEXT = 'Unsubscribe for free: Profile > Settings > Notifications > turn off Marketing alerts';

interface Props {
	content: NotificationContent;
}

/**
 * 수신 기기에 표시되는 알림의 미리보기 컴포넌트
 * @param content 알림 내용 입력값
 */
const NotificationPreview = ({ content }: Props) => {
	const marketing = content.kind === 'marketing';
	const koreanBody = content.body.ko_kr.trim();
	const englishTitle = content.title.en_us.trim();
	const englishBody = content.body.en_us.trim();

	// 한국어가 비어 있으면 영어 문구 발송
	const pushes = [
		{
			label: '한국어',
			title: content.title.ko_kr.trim() || englishTitle,
			body: koreanBody || englishBody,
			unsubscribeText: koreanBody ? KOREAN_UNSUBSCRIBE_TEXT : ENGLISH_UNSUBSCRIBE_TEXT,
		},
		{ label: '영어', title: englishTitle, body: englishBody, unsubscribeText: ENGLISH_UNSUBSCRIBE_TEXT },
	];

	return (
		<aside className="grid content-start gap-3.5 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
			<h3 className="text-base font-bold">미리보기</h3>

			{pushes.map((push) => (
				<section key={push.label} className="grid gap-1.5">
					<h4 className="text-[13px] font-semibold text-muted-foreground">{push.label}</h4>

					{/*푸시 알림 모양*/}
					<div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 rounded-xl bg-card p-3 ring-1 ring-border">
						<p className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
							<Image src="/images/mascot.svg" alt="" width={18} height={18} />
							버디버드
							<span className="ml-auto">지금</span>
						</p>

						<div className="min-w-0 wrap-anywhere">
							<strong
								className={cn('block font-bold', !push.title && 'font-normal text-muted-foreground')}
							>
								{marketing && MARKETING_TITLE_PREFIX}
								{push.title || '제목'}
							</strong>

							{/*마케팅 알림은 서버가 앞뒤에 문구를 붙여 발송*/}
							<p
								className={cn(
									'text-[13px] leading-snug whitespace-pre-line',
									!push.body && 'text-muted-foreground',
								)}
							>
								{marketing && `${MARKETING_BODY_PREFIX}\n`}
								{push.body || '본문'}
								{marketing && `\n${push.unsubscribeText}`}
							</p>
						</div>

						{!!content.imagePreviewUrl && (
							<Image
								src={content.imagePreviewUrl}
								alt=""
								width={44}
								height={44}
								unoptimized
								className="size-11 rounded-md object-cover"
							/>
						)}
					</div>
				</section>
			))}
		</aside>
	);
};

export default NotificationPreview;

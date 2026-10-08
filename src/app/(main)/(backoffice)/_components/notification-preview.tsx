import type { NotificationContent } from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import PushPreviewCard from '@/app/(main)/(backoffice)/_components/push-preview-card';

const MARKETING_PREFIX = '(광고) ';
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

					{/*마케팅 알림은 서버가 앞뒤에 문구를 붙여 발송*/}
					<PushPreviewCard
						title={push.title}
						body={push.body}
						prefix={marketing ? MARKETING_PREFIX : undefined}
						bodySuffix={marketing ? `\n${push.unsubscribeText}` : undefined}
						imageUrl={content.imagePreviewUrl}
					/>
				</section>
			))}
		</aside>
	);
};

export default NotificationPreview;

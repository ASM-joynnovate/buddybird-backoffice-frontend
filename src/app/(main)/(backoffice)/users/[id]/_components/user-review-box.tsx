import type { SessionEvent, SessionSound } from '@/types/apis/sessions';

import { cn } from '@/lib/utils';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import TitledBox from '@/app/(main)/(backoffice)/_components/titled-box';
import UserReviewIcon from '@/app/(main)/(backoffice)/_components/user-review-icon';
import { SESSION_SOUND_KINDS } from '@/config/session';
import { formatShortDateTime } from '@/utils/date';

interface Props {
	userReview: SessionSound['user_review'] | SessionEvent['user_review'];
}

/**
 * 사용자 리뷰 상자 컴포넌트
 * @param userReview 사용자 리뷰
 */
const UserReviewBox = ({ userReview }: Props) => {
	return (
		<TitledBox
			title="사용자 리뷰"
			action={
				!!userReview && (
					<time className="text-[12.5px] text-muted-foreground tabular-nums">
						{formatShortDateTime(userReview.updated_at)}
					</time>
				)
			}
		>
			{userReview ? (
				<dl className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 p-3 text-[13px]">
					{'kind' in userReview && (
						<>
							<dt className="text-muted-foreground">리뷰 당시의 결과</dt>
							<dd>
								<ColorTag color={SESSION_SOUND_KINDS[userReview.kind].color}>
									{SESSION_SOUND_KINDS[userReview.kind].label}
								</ColorTag>
							</dd>
						</>
					)}

					<dt className="text-muted-foreground">리뷰</dt>
					<dd
						className={cn(
							'flex items-center gap-1.5 font-semibold',
							userReview.is_correct ? 'text-success' : 'text-destructive',
						)}
					>
						<UserReviewIcon correct={userReview.is_correct} className="size-3.5" />
						{userReview.is_correct ? '맞음' : '틀림'}
					</dd>
				</dl>
			) : (
				<p className="p-3 text-[13px] text-muted-foreground">리뷰 없음</p>
			)}
		</TitledBox>
	);
};

export default UserReviewBox;

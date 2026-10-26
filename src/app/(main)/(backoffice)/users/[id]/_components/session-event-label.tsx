'use client';

import type { SessionEvent } from '@/types/apis/sessions';

import { CircleDashed } from 'lucide-react';

import CorrectnessIcon from '@/app/(main)/(backoffice)/_components/correctness-icon';
import UserReviewIcon from '@/app/(main)/(backoffice)/_components/user-review-icon';
import SessionEventLabelContent from '@/app/(main)/(backoffice)/users/[id]/_components/session-event-label-content';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	sessionId: string;
	eventId: string;
	title: string;
	isCorrect: SessionEvent['is_correct'];
	userReview: SessionEvent['user_review'];
}

/**
 * 세션 이벤트의 라벨 버튼 컴포넌트
 * @param sessionId 이벤트가 속한 세션 ID
 * @param eventId 라벨을 저장할 이벤트 ID
 * @param title 이벤트의 시각 및 이름
 * @param isCorrect 운영자 라벨
 * @param userReview 사용자 리뷰
 */
const SessionEventLabel = ({ sessionId, eventId, title, isCorrect, userReview }: Props) => {
	return (
		<Popover>
			<PopoverTrigger
				render=<Button variant="outline" size="sm" />
				aria-label={`${title} 라벨`}
				title="라벨"
				className="px-2"
			>
				{isCorrect === null ? (
					<CircleDashed aria-label="라벨 없음" className="text-muted-foreground" />
				) : (
					<CorrectnessIcon correct={isCorrect} label={isCorrect ? '맞음' : '틀림'} className="size-3.5" />
				)}
				{!!userReview && <UserReviewIcon correct={userReview.is_correct} className="size-3.5" />}
			</PopoverTrigger>

			<PopoverContent align="end" className="w-80 gap-2.5 p-3">
				<PopoverTitle className="px-0.5 font-bold tabular-nums">{title}</PopoverTitle>

				<ErrorHandlingWrapper
					fallbackComponent={QueryError}
					suspenseFallback=<Skeleton className="h-72 rounded-lg" />
				>
					<SessionEventLabelContent sessionId={sessionId} eventId={eventId} />
				</ErrorHandlingWrapper>
			</PopoverContent>
		</Popover>
	);
};

export default SessionEventLabel;

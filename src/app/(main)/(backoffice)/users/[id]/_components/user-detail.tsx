import Link from 'next/link';

import type { CountedPage } from '@/types/apis/common';
import type { Session } from '@/types/apis/sessions';

import { ChevronLeft } from 'lucide-react';

import ConsentCard from '@/app/(main)/(backoffice)/users/[id]/_components/consent-card';
import ConsentCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/consent-card-skeleton';
import CurrentSessionCard from '@/app/(main)/(backoffice)/users/[id]/_components/current-session-card';
import CurrentSessionCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/current-session-card-skeleton';
import DeviceCard from '@/app/(main)/(backoffice)/users/[id]/_components/device-card';
import DeviceCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/device-card-skeleton';
import FeedbackCard from '@/app/(main)/(backoffice)/users/[id]/_components/feedback-card';
import FeedbackCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/feedback-card-skeleton';
import NotificationCard from '@/app/(main)/(backoffice)/users/[id]/_components/notification-card';
import NotificationCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/notification-card-skeleton';
import ParrotCard from '@/app/(main)/(backoffice)/users/[id]/_components/parrot-card';
import ParrotCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/parrot-card-skeleton';
import SessionTimelinePrefetch from '@/app/(main)/(backoffice)/users/[id]/_components/session-timeline-prefetch';
import SettingsCard from '@/app/(main)/(backoffice)/users/[id]/_components/settings-card';
import SettingsCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/settings-card-skeleton';
import UserProfileCard from '@/app/(main)/(backoffice)/users/[id]/_components/user-profile-card';
import UserProfileCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/user-profile-card-skeleton';
import UserSessionCard from '@/app/(main)/(backoffice)/users/[id]/_components/user-session-card';
import UserSessionCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/user-session-card-skeleton';
import WithdrawalCard from '@/app/(main)/(backoffice)/users/[id]/_components/withdrawal-card';
import WordCard from '@/app/(main)/(backoffice)/users/[id]/_components/word-card';
import WordCardSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/word-card-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	id: string;
	sessionPage: number;
	sessionList: Promise<CountedPage<Session> | undefined>;
	today: string;
	now: number;
}

/**
 * 사용자 상세 화면 컴포넌트
 * @param id 조회할 사용자 ID
 * @param sessionPage 세션 목록의 페이지 번호
 * @param sessionList 페이지에서 시작한 세션 목록 조회
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const UserDetail = ({ id, sessionPage, sessionList, today, now }: Props) => {
	return (
		<>
			<Link
				href="/users"
				className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
			>
				<ChevronLeft className="size-4" />
				사용자 목록
			</Link>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<UserProfileCardSkeleton />>
				<UserProfileCard id={id} initialNow={now} />
			</ErrorHandlingWrapper>

			<div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<CurrentSessionCardSkeleton />>
					<CurrentSessionCard id={id} initialNow={now} />
				</ErrorHandlingWrapper>

				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ParrotCardSkeleton />>
					<ParrotCard id={id} today={today} />
				</ErrorHandlingWrapper>
			</div>

			{/*세션 목록의 페이지가 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={sessionPage}
				fallbackComponent={QueryError}
				suspenseFallback=<UserSessionCardSkeleton />
			>
				<SessionTimelinePrefetch sessionList={sessionList} />
				<UserSessionCard id={id} page={sessionPage} initialNow={now} />
			</ErrorHandlingWrapper>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="contents xl:grid xl:gap-4">
					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<NotificationCardSkeleton id={id} />
					>
						<NotificationCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<FeedbackCardSkeleton />>
						<FeedbackCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ConsentCardSkeleton />>
						<ConsentCard id={id} />
					</ErrorHandlingWrapper>
				</div>

				<div className="contents xl:grid xl:gap-4">
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
						<WithdrawalCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<DeviceCardSkeleton />>
						<DeviceCard id={id} initialNow={now} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<WordCardSkeleton />>
						<WordCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<SettingsCardSkeleton />>
						<SettingsCard id={id} />
					</ErrorHandlingWrapper>
				</div>
			</div>
		</>
	);
};

export default UserDetail;

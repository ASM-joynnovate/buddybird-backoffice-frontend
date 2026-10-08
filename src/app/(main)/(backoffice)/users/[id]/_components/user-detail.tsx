import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';

import TitledCardSkeleton from '@/app/(main)/(backoffice)/_components/titled-card-skeleton';
import ConsentCard from '@/app/(main)/(backoffice)/users/[id]/_components/consent-card';
import CurrentSessionCard from '@/app/(main)/(backoffice)/users/[id]/_components/current-session-card';
import DeviceCard from '@/app/(main)/(backoffice)/users/[id]/_components/device-card';
import FeedbackCard from '@/app/(main)/(backoffice)/users/[id]/_components/feedback-card';
import NotificationCard from '@/app/(main)/(backoffice)/users/[id]/_components/notification-card';
import ParrotCard from '@/app/(main)/(backoffice)/users/[id]/_components/parrot-card';
import SettingsCard from '@/app/(main)/(backoffice)/users/[id]/_components/settings-card';
import UserProfileCard from '@/app/(main)/(backoffice)/users/[id]/_components/user-profile-card';
import UserSessionCard from '@/app/(main)/(backoffice)/users/[id]/_components/user-session-card';
import WithdrawalCard from '@/app/(main)/(backoffice)/users/[id]/_components/withdrawal-card';
import WordCard from '@/app/(main)/(backoffice)/users/[id]/_components/word-card';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	id: string;
	sessionPage: number;
	today: string;
	now: number;
}

/**
 * 사용자 상세 화면 컴포넌트
 * @param id 조회할 사용자 ID
 * @param sessionPage 세션 목록의 페이지 번호
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const UserDetail = ({ id, sessionPage, today, now }: Props) => {
	return (
		<>
			<Link
				href="/users"
				className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
			>
				<ChevronLeft className="size-4" />
				사용자 목록
			</Link>

			<ErrorHandlingWrapper
				fallbackComponent={QueryError}
				suspenseFallback=<Card className="gap-4 px-5 py-4.5">
					<Skeleton className="h-14 w-64" />
					<Skeleton className="h-17" />
				</Card>
			>
				<UserProfileCard id={id} initialNow={now} />
			</ErrorHandlingWrapper>

			<div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<ErrorHandlingWrapper
					fallbackComponent={QueryError}
					suspenseFallback=<TitledCardSkeleton title="현재 세션" rowCount={4} />
				>
					<CurrentSessionCard id={id} initialNow={now} />
				</ErrorHandlingWrapper>

				<ErrorHandlingWrapper
					fallbackComponent={QueryError}
					suspenseFallback=<TitledCardSkeleton title="앵무새" rowCount={4} />
				>
					<ParrotCard id={id} today={today} />
				</ErrorHandlingWrapper>
			</div>

			{/*세션 목록의 페이지가 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={sessionPage}
				fallbackComponent={QueryError}
				suspenseFallback=<TitledCardSkeleton title="세션" rowCount={7} />
			>
				<UserSessionCard id={id} page={sessionPage} initialNow={now} />
			</ErrorHandlingWrapper>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="contents xl:grid xl:gap-4">
					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<TitledCardSkeleton title="알림" rowCount={5} />
					>
						<NotificationCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<TitledCardSkeleton title="피드백" rowCount={2} />
					>
						<FeedbackCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<TitledCardSkeleton title="동의" rowCount={4} />
					>
						<ConsentCard id={id} />
					</ErrorHandlingWrapper>
				</div>

				<div className="contents xl:grid xl:gap-4">
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
						<WithdrawalCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<TitledCardSkeleton title="기기" rowCount={6} />
					>
						<DeviceCard id={id} initialNow={now} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<TitledCardSkeleton title="단어" rowCount={5} />
					>
						<WordCard id={id} />
					</ErrorHandlingWrapper>

					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<TitledCardSkeleton title="설정" rowCount={6} />
					>
						<SettingsCard id={id} />
					</ErrorHandlingWrapper>
				</div>
			</div>
		</>
	);
};

export default UserDetail;

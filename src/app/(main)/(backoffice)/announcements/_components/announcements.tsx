import type { AnnouncementListParams } from '@/types/apis/announcements';

import type { SearchParamValue } from '@/lib/api';

import AnnouncementScheduleCard from '@/app/(main)/(backoffice)/announcements/_components/announcement-schedule-card';
import AnnouncementScheduleSkeleton from '@/app/(main)/(backoffice)/announcements/_components/announcement-schedule-skeleton';
import CreateAnnouncementButton from '@/app/(main)/(backoffice)/announcements/_components/create-announcement-button';
import EndedAnnouncementCard from '@/app/(main)/(backoffice)/announcements/_components/ended-announcement-card';
import EndedAnnouncementSkeleton from '@/app/(main)/(backoffice)/announcements/_components/ended-announcement-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	activeListParams: AnnouncementListParams;
	endedListParams: AnnouncementListParams;
	query: Record<string, SearchParamValue>;
	now: number;
}

/**
 * 공지 화면 컴포넌트
 * @param activeListParams 게시 중이거나 예약된 공지의 조회 조건
 * @param endedListParams 종료된 공지의 조회 조건
 * @param query 현재 주소의 쿼리
 * @param now 서버가 화면을 그린 시각
 */
const Announcements = ({ activeListParams, endedListParams, query, now }: Props) => {
	return (
		<>
			<div className="flex items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">공지</h1>

				<CreateAnnouncementButton />
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<AnnouncementScheduleSkeleton />>
				<AnnouncementScheduleCard listParams={activeListParams} now={now} />
			</ErrorHandlingWrapper>

			<ErrorHandlingWrapper
				fallbackComponent={QueryError}
				suspenseFallback=<EndedAnnouncementSkeleton query={query} />
			>
				<EndedAnnouncementCard listParams={endedListParams} query={query} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default Announcements;

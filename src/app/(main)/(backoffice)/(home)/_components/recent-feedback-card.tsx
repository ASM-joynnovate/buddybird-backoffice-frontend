import RecentFeedbackTable from '@/app/(main)/(backoffice)/(home)/_components/recent-feedback-table';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;

/** 최근 피드백 카드 컴포넌트 */
const RecentFeedbackCard = () => {
	return (
		<TitledCard title="최근 피드백" href="/feedback" linkLabel="전체 보기">
			<ErrorHandlingWrapper
				fallbackComponent={QueryError}
				suspenseFallback=<div className="space-y-2.5">
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-8" />
					))}
				</div>
			>
				<RecentFeedbackTable />
			</ErrorHandlingWrapper>
		</TitledCard>
	);
};

export default RecentFeedbackCard;

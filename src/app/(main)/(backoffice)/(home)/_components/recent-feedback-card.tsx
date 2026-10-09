import RecentFeedbackTable from '@/app/(main)/(backoffice)/(home)/_components/recent-feedback-table';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PLACEHOLDER_ROW_COUNT = 5;

/** 최근 피드백 카드 컴포넌트 */
const RecentFeedbackCard = () => {
	return (
		<TitledCard title="최근 피드백" href="/feedback" linkLabel="전체 보기">
			<ErrorHandlingWrapper
				fallbackComponent={QueryError}
				suspenseFallback=<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="pl-0 text-muted-foreground">작성 일시</TableHead>
							<TableHead className="text-muted-foreground">내용</TableHead>
							<TableHead className="text-muted-foreground">앱 버전</TableHead>
							<TableHead className="text-muted-foreground">사용자</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
							<TableRow key={index}>
								<TableCell className="py-2.5 pl-0">
									<SkeletonText className="h-5 w-30" />
								</TableCell>
								<TableCell className="w-full max-w-0 min-w-60 py-2.5">
									<SkeletonText className="h-5" />
								</TableCell>
								<TableCell className="py-2.5">
									<SkeletonText className="h-5 w-9" />
								</TableCell>
								<TableCell className="py-2.5">
									<SkeletonText className="h-5 w-16" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			>
				<RecentFeedbackTable />
			</ErrorHandlingWrapper>
		</TitledCard>
	);
};

export default RecentFeedbackCard;

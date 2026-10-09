import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { USER_RECENT_ITEM_COUNT } from '@/config';

import { SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** 사용자의 최근 피드백 카드를 불러오는 동안 보이는 컴포넌트 */
const FeedbackCardSkeleton = () => {
	return (
		<TitledCard title="피드백">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-0 text-muted-foreground">작성 일시</TableHead>
						<TableHead className="text-muted-foreground">내용</TableHead>
						<TableHead className="text-muted-foreground">앱 버전</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{Array.from({ length: USER_RECENT_ITEM_COUNT }, (_, index) => (
						<TableRow key={index}>
							<TableCell className="py-2.5 pl-0">
								<SkeletonText className="h-5 w-28" />
							</TableCell>
							<TableCell className="min-w-50 py-2.5">
								{/*좁은 화면에서는 내용이 두 줄로 표시됨*/}
								<SkeletonText className="h-5" />
								<SkeletonText className="h-5 md:hidden" />
							</TableCell>
							<TableCell className="py-2.5">
								<SkeletonText className="h-5 w-10" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TitledCard>
	);
};

export default FeedbackCardSkeleton;

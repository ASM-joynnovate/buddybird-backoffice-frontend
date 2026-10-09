import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { USER_RECENT_ITEM_COUNT } from '@/config';

import { Badge } from '@/components/ui/badge';
import { SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	id: string;
}

/**
 * 사용자의 최근 알림 카드를 불러오는 동안 보이는 컴포넌트
 * @param id 조회할 사용자 ID
 */
const NotificationCardSkeleton = ({ id }: Props) => {
	return (
		<TitledCard title="알림" href={`/notifications?user_id=${id}`} linkLabel="알림 탭에서 전체 보기">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-0 text-muted-foreground">발송 일시</TableHead>
						<TableHead className="text-muted-foreground">종류</TableHead>
						<TableHead className="text-muted-foreground">제목</TableHead>
						<TableHead className="text-muted-foreground">읽음</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{Array.from({ length: USER_RECENT_ITEM_COUNT }, (_, index) => (
						<TableRow key={index}>
							<TableCell className="py-2.5 pl-0">
								<SkeletonText className="h-5 w-28" />
							</TableCell>
							<TableCell className="py-2.5">
								{/*글자가 있어야 태그가 든 행과 높이가 같음*/}
								<Badge variant="muted" className="w-14 animate-pulse">
									&nbsp;
								</Badge>
							</TableCell>
							<TableCell className="min-w-50 py-2.5">
								<SkeletonText className="h-5" />
							</TableCell>
							<TableCell className="py-2.5">
								<SkeletonText className="h-5 w-28" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TitledCard>
	);
};

export default NotificationCardSkeleton;

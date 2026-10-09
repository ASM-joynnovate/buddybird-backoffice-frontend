import { Badge } from '@/components/ui/badge';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PLACEHOLDER_ROW_COUNT = 5;

/** 푸시 발송 기록 목록을 불러오는 동안 보이는 컴포넌트 */
const PushDeliveryListSkeleton = () => {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-0 text-muted-foreground">발송 일시</TableHead>
						<TableHead className="text-muted-foreground">종류</TableHead>
						<TableHead className="text-muted-foreground">제목</TableHead>
						<TableHead className="text-muted-foreground">본문</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
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
							<TableCell className="min-w-40 py-2.5">
								<SkeletonText className="h-5" />
							</TableCell>
							<TableCell className="min-w-40 py-2.5">
								<SkeletonText className="h-5" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className="flex justify-end gap-1.5">
				<Skeleton className="h-7 w-11" />
				<Skeleton className="h-7 w-11" />
			</div>
		</>
	);
};

export default PushDeliveryListSkeleton;

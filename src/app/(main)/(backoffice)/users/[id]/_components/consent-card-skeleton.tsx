import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Badge } from '@/components/ui/badge';
import { SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PLACEHOLDER_ROW_COUNT = 4;

/** 사용자의 동의 내역 카드를 불러오는 동안 보이는 컴포넌트 */
const ConsentCardSkeleton = () => {
	return (
		<TitledCard title="동의">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-0 text-muted-foreground">결정 일시</TableHead>
						<TableHead className="text-muted-foreground">고지문</TableHead>
						<TableHead className="text-muted-foreground">버전</TableHead>
						<TableHead className="text-muted-foreground">결정</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<TableRow key={index}>
							<TableCell className="py-2.5 pl-0">
								<SkeletonText className="h-5 w-28" />
							</TableCell>
							<TableCell className="min-w-50 py-2.5">
								<SkeletonText className="h-5" />
							</TableCell>
							<TableCell className="py-2.5">
								<SkeletonText className="h-5 w-6" />
							</TableCell>
							<TableCell className="py-2.5">
								{/*글자가 있어야 태그가 든 행과 높이가 같음*/}
								<Badge variant="muted" className="w-10 animate-pulse">
									&nbsp;
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TitledCard>
	);
};

export default ConsentCardSkeleton;

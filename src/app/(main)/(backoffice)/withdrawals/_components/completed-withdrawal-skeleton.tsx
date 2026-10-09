import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COLUMN_LABELS = ['사용자', '계정', '사용 기간', '세션', '기기', '피드백'];
const PLACEHOLDER_ROW_COUNT = 5;

/** 완료된 탈퇴 카드를 불러오는 동안 보이는 컴포넌트 */
const CompletedWithdrawalSkeleton = () => {
	return (
		<TitledCard title="완료">
			<div className="-mx-2 -mt-2">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{COLUMN_LABELS.map((columnLabel) => (
								<TableHead key={columnLabel} className="text-muted-foreground">
									{columnLabel}
								</TableHead>
							))}
							<TableHead className="text-right text-muted-foreground">요청</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
							<TableRow key={index} className="hover:bg-transparent [&>td]:py-2.5">
								<TableCell>
									<div className="flex items-center gap-2.5">
										<Skeleton className="size-9 rounded-full" />
										<div>
											<SkeletonText className="h-5 w-20" />
											<SkeletonText className="w-32 text-[13px]" />
										</div>
									</div>
								</TableCell>
								<TableCell>
									{/*로그인 방식 칩*/}
									<Skeleton className="h-5 w-16" />
								</TableCell>
								{COLUMN_LABELS.slice(2).map((columnLabel) => (
									<TableCell key={columnLabel}>
										<SkeletonText className="h-5 w-16" />
									</TableCell>
								))}
								<TableCell>
									<SkeletonText className="ml-auto h-5 w-16" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</TitledCard>
	);
};

export default CompletedWithdrawalSkeleton;

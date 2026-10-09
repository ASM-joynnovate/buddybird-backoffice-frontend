import { Card } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PLACEHOLDER_ROW_COUNT = 5;
const COLUMN_LABELS = ['사용자', '앵무새', '상태', '최근 14일 세션', '세션', '기기', '가입일'];

/** 사용자 표를 불러오는 동안 보이는 컴포넌트 */
const UserTableSkeleton = () => {
	return (
		<>
			<Card className="gap-0 px-2 pt-1 pb-2 md:px-3 md:pt-2 md:pb-3">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{COLUMN_LABELS.map((label) => (
								<TableHead key={label} className="text-muted-foreground">
									{label}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
							<TableRow key={index} className="hover:bg-transparent [&>td]:py-2.5">
								<TableCell>
									<div className="flex items-center gap-2.5">
										<Skeleton className="size-9 shrink-0 rounded-full" />
										<div>
											<SkeletonText className="h-5 w-16" />
											<SkeletonText className="w-32 text-[13px]" />
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2.5">
										<Skeleton className="size-9 shrink-0" />
										<SkeletonText className="h-5 w-20" />
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-7 w-36" />
								</TableCell>
								<TableCell>
									<SkeletonText className="h-5 w-10" />
								</TableCell>
								<TableCell>
									<SkeletonText className="h-5 w-32" />
								</TableCell>
								<TableCell>
									<SkeletonText className="h-5 w-20" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			{/*페이지 이동 링크 자리*/}
			<Skeleton className="mx-auto h-9 w-64" />
		</>
	);
};

export default UserTableSkeleton;

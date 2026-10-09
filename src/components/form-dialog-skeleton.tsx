import { cn } from '@/lib/utils';

import { DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_FIELD_COUNT = 3;

interface Props {
	className?: string;
}

/**
 * 다이얼로그의 입력 폼을 불러오는 동안 보이는 컴포넌트
 * @param className 폼과 칸 너비 및 높이를 맞출 클래스
 */
const FormDialogSkeleton = ({ className }: Props) => {
	return (
		<>
			{/*폼이 화면보다 길어지는 좁은 화면에서는 다이얼로그 최대 높이까지 채움*/}
			<div className={cn('grid min-h-dvh md:grid-cols-[minmax(0,1fr)_380px] lg:min-h-140', className)}>
				<div className="grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
					{Array.from({ length: PLACEHOLDER_FIELD_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-9" />
					))}
					<Skeleton className="h-40" />
				</div>

				<div className="border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
					<Skeleton className="h-50 rounded-xl" />
				</div>
			</div>

			<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
				<Skeleton className="h-9 w-14" />
				<Skeleton className="h-9 w-24" />
			</DialogFooter>
		</>
	);
};

export default FormDialogSkeleton;

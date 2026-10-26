import { cn } from '@/lib/utils';

import TitledBox from '@/app/(main)/(backoffice)/_components/titled-box';
import { SESSION_SOUND_LABEL_TARGETS } from '@/config/session';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const fieldLabelClassName = 'text-[13px] font-semibold text-muted-foreground';

/** 선택한 소리의 상세를 불러오는 동안 표시하는 컴포넌트 */
const SessionSoundDetailSkeleton = () => {
	return (
		<>
			<div className="grid min-w-0 gap-2.5 rounded-lg border bg-card p-3">
				<div className="flex items-center gap-2.5">
					<Skeleton className="size-8 shrink-0 rounded-full" />

					<div className="mr-auto min-w-0">
						<SkeletonText className="w-28" />
						<SkeletonText className="w-8 text-[12.5px]" />
					</div>

					<Skeleton className="size-7" />
				</div>

				<dl className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-3 border-t pt-2.5 text-[13px]">
					<dt className="text-muted-foreground">최종 결과</dt>
					<dd>
						<Skeleton className="h-5 w-18" />
					</dd>
				</dl>
			</div>

			<TitledBox title="사용자 리뷰">
				<SkeletonText className="m-3 w-14 text-[13px]" />
			</TitledBox>

			{Object.values(SESSION_SOUND_LABEL_TARGETS).map((targetName) => (
				<TitledBox key={targetName} title={targetName} action=<SkeletonText className="w-20 text-[12.5px]" />>
					<div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5 p-3">
						<span className={fieldLabelClassName}>판정</span>
						<div className="grid grid-cols-2 gap-2">
							<Skeleton className="h-9" />
							<Skeleton className="h-9" />
						</div>

						<span className={fieldLabelClassName}>점수</span>
						<Skeleton className="h-9 w-16" />

						<span className={cn(fieldLabelClassName, 'self-start pt-2')}>메모</span>
						<Skeleton className="h-14" />
					</div>

					<div className="flex justify-end border-t px-3 py-2.5">
						<Skeleton className="h-9 w-14" />
					</div>
				</TitledBox>
			))}

			<TitledBox title="모델 결과" action=<Skeleton className="h-7 w-22" />>
				<div className="grid gap-2 p-3">
					<SkeletonText className="text-[13px]" />
					<SkeletonText className="text-[13px]" />
				</div>
			</TitledBox>
		</>
	);
};

export default SessionSoundDetailSkeleton;

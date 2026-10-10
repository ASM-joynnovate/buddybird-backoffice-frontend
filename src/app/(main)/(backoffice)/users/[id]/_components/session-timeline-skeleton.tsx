import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const STAT_LABELS = ['단어', '앵무새 소리', '따라 한 횟수'];
const LEGEND_LABELS = ['세션', '수면 시간', '연결 끊김', '응급 상황', '따라 함'];
const PLACEHOLDER_EVENT_WIDTHS = ['w-39.5', 'w-46', 'w-39.5', 'w-39.5', 'w-39', 'w-38.5', 'w-49', 'w-46', 'w-39.5'];
const laneLabelClassName = '-mb-2 text-[12.5px] text-muted-foreground';

/** 세션 하나의 타임라인을 불러오는 동안 보이는 컴포넌트 */
const SessionTimelineSkeleton = () => {
	return (
		<div className="grid min-w-0 content-start gap-4 p-4 md:px-5.5 md:py-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<SkeletonText className="h-6 w-36" />
				<Skeleton className="h-7 w-36" />
			</div>

			<dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
				{/*칸이 좁으면 길이의 시간과 분이 두 줄로 나뉨*/}
				<StatCell label="길이">
					<div className="flex flex-wrap gap-x-1">
						<SkeletonText className="my-0.5 h-6 w-10.5 *:bg-background" />
						<SkeletonText className="my-0.5 h-6 w-9.5 *:bg-background" />
					</div>
				</StatCell>
				{STAT_LABELS.map((label) => (
					<StatCell key={label} label={label}>
						<SkeletonText className="my-0.5 h-6 w-16 *:bg-background" />
					</StatCell>
				))}
			</dl>

			<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
				{LEGEND_LABELS.map((label) => (
					<span key={label} className="inline-flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-muted" />
						{label}
					</span>
				))}
				<span className="ml-auto text-[12.5px] max-md:hidden">드래그해 이동, Ctrl + 스크롤로 확대</span>
			</div>

			<div className="grid gap-3.5 px-1.5 pt-3.5 pb-1">
				<p className={laneLabelClassName}>진행 및 이벤트</p>
				<Skeleton className="h-4 rounded-full" />
				<p className={laneLabelClassName}>앵무새 소리</p>
				<Skeleton className="h-10" />
				<p className={laneLabelClassName}>따라 함</p>
				<Skeleton className="h-2.5" />
				<SkeletonText className="text-[11.5px]" />
			</div>

			<Skeleton className="h-15 rounded-lg" />

			<div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 text-[12.5px] text-muted-foreground">
				전체 구간
				<Skeleton className="h-4.5" />
			</div>

			<div className="flex flex-wrap gap-1.5">
				{PLACEHOLDER_EVENT_WIDTHS.map((width, index) => (
					<Skeleton key={index} className={`h-7 ${width}`} />
				))}
			</div>
		</div>
	);
};

export default SessionTimelineSkeleton;

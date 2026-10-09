import { PHASE_CYCLE } from '@/config';
import { SESSION_PHASES } from '@/config/session';
import { MINUTE } from '@/config/units';

import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const SESSION_INFO_LABELS = ['단어', '예정 종료', '수면 시간', '스테이션'];

/** 현재 세션 카드를 불러오는 동안 보이는 컴포넌트 */
const CurrentSessionCardSkeleton = () => {
	return (
		<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
			<div className="grid content-between gap-4.5 p-4 md:px-5.5 md:py-5">
				<div className="flex items-center justify-between gap-3">
					<CardTitle className="font-bold">현재 세션</CardTitle>
					<SkeletonText className="w-24 text-[13px]" />
				</div>

				<div>
					<SkeletonText className="w-44 text-[44px] leading-[1.1]" />
					<SkeletonText className="mt-1 w-32 text-[13px]" />
				</div>

				<ul className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]">
					{PHASE_CYCLE.map(({ phase, durationMs }) => (
						<li
							key={phase}
							className="grid gap-0.5 rounded-lg bg-muted px-3 pt-2.5 pb-3 text-muted-foreground"
						>
							<span className="text-[13px] font-semibold">{SESSION_PHASES[phase].label}</span>
							<p className="text-[26px] leading-[1.15] font-bold tracking-tight">
								{durationMs / MINUTE}
								<span className="ml-0.5 text-[13px] font-semibold tracking-normal">분</span>
							</p>
							<Skeleton className="mt-1.5 h-1 bg-background" />
						</li>
					))}
				</ul>
			</div>

			<div className="grid content-start gap-4 border-t bg-card-inset p-4 md:px-5.5 md:py-5 xl:border-t-0 xl:border-l">
				<CardTitle className="font-bold">세션 정보</CardTitle>

				<dl className="divide-y">
					{SESSION_INFO_LABELS.map((label) => (
						<div key={label} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
							<dt className="text-muted-foreground">{label}</dt>
							<dd>
								<SkeletonText className="h-5 w-24" />
							</dd>
						</div>
					))}
				</dl>
			</div>
		</Card>
	);
};

export default CurrentSessionCardSkeleton;

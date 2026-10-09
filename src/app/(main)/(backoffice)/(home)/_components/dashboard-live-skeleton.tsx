import type { CSSProperties } from 'react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { SESSION_PHASES } from '@/config/session';

import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const TODAY_STAT_LABELS = ['시작', '종료', '평균 진행 시간'];
const CHECK_ITEM_LABELS = ['신호가 끊긴 세션', '응급 상황 감지', '탈퇴 실패', '모사 판정 실패'];

/** 현재 상태 카드를 불러오는 동안 보이는 컴포넌트 */
const DashboardLiveSkeleton = () => {
	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
				{/*현재 개수 및 단계별 개수 자리*/}
				<div className="grid content-between gap-4.5 p-4 md:px-5.5 md:py-5">
					<div className="flex items-baseline justify-between gap-3">
						<CardTitle className="font-bold">실행 중인 세션</CardTitle>
						<Skeleton className="h-3.5 w-16" />
					</div>

					<div className="grid items-center gap-3.5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
						<SkeletonText className="h-14 w-25 md:h-17" />

						<ul className="grid grid-cols-2 gap-2">
							{Object.entries(SESSION_PHASES).map(([phase, { label, color }]) => (
								<li
									key={phase}
									style={{ '--phase-color': color } as CSSProperties}
									className="grid gap-0.5 rounded-lg bg-(--phase-color)/9 px-3 pt-2.5 pb-3"
								>
									<span className="flex items-center gap-1.5 text-[13px] font-semibold whitespace-nowrap">
										<span className="size-2 shrink-0 rounded-full bg-(--phase-color)" />
										{label}
									</span>

									<SkeletonText className="w-12 text-[26px] leading-[1.15]" />
									<div className="mt-1.5 h-1 rounded-full bg-(--phase-color)/22" />
								</li>
							))}
						</ul>
					</div>
				</div>

				{/*오늘의 시작, 종료 및 시간대별 개수 자리*/}
				<div className="grid content-between gap-4 border-t bg-card-inset p-4 md:px-5.5 md:py-5 xl:border-t-0 xl:border-l">
					<div className="flex items-baseline justify-between gap-3">
						<CardTitle className="font-bold">오늘</CardTitle>
						<p className="text-[13px] text-muted-foreground">시간대별 실행 중인 세션</p>
					</div>

					<dl className="flex gap-5 md:gap-7">
						{TODAY_STAT_LABELS.map((label) => (
							<div key={label}>
								<dt className="text-[13px] text-muted-foreground">{label}</dt>
								<dd>
									<SkeletonText className="h-7 w-10" />
								</dd>
							</div>
						))}
					</dl>

					<div>
						<Skeleton className="h-21" />

						<ol
							aria-hidden
							className="mt-1.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums"
						>
							<li>0시</li>
							<li>6시</li>
							<li>12시</li>
							<li>18시</li>
							<li>24시</li>
						</ol>
					</div>
				</div>
			</Card>

			<TitledCard title="확인할 항목" action=<Skeleton className="h-3.5 w-8" />>
				<ul className="divide-y">
					{CHECK_ITEM_LABELS.map((label) => (
						<li key={label}>
							<div className="flex h-10.5 items-center gap-2.5 pr-6">
								<span className="size-2 shrink-0 rounded-full bg-muted" />
								{label}
								<SkeletonText className="ml-auto h-5 w-5" />
							</div>
						</li>
					))}
				</ul>
			</TitledCard>
		</div>
	);
};

export default DashboardLiveSkeleton;

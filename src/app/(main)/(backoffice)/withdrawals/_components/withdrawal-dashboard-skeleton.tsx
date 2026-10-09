import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

// 그룹 제목 및 범례 글자의 폭
const PLACEHOLDER_GROUPS = [
	{ title: '계정', legendWidths: [100, 92, 92, 56] },
	{ title: '기기', legendWidths: [76, 104] },
	{ title: '사용 기간', legendWidths: [56, 80, 88] },
	{ title: '세션', legendWidths: [80, 68, 56] },
	{ title: '앱 버전', legendWidths: [64, 60] },
	{ title: '앵무새', legendWidths: [56, 72] },
];
const PLACEHOLDER_ERROR_COUNT = 2;

/** 탈퇴 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const WithdrawalDashboardSkeleton = () => {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
			<TitledCard title="탈퇴 추이">
				<SkeletonText className="w-30 text-[44px] leading-[1.1]" />
				<SkeletonText className="mt-1.5 w-38 text-[13px]" />
				<Skeleton className="mt-3.5 h-38" />
				<dl className="mt-3.5 grid grid-cols-2 gap-2">
					<StatCell label="하루 평균">
						<SkeletonText className="w-12" />
					</StatCell>
					<StatCell label="가입">
						<SkeletonText className="w-12" />
					</StatCell>
				</dl>
			</TitledCard>

			<TitledCard title="구성">
				<div className="grid grid-cols-1 content-start gap-x-6 gap-y-4.5 md:grid-cols-3 xl:grid-cols-2">
					{PLACEHOLDER_GROUPS.map(({ title, legendWidths }) => (
						<section key={title}>
							<h3 className="mb-2 text-[13px] font-semibold">{title}</h3>
							<Skeleton className="h-3 rounded-full" />
							<ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px]">
								{legendWidths.map((legendWidth, index) => (
									<li key={index}>
										<div className="inline-flex items-center gap-1.5">
											<Skeleton className="size-2 rounded-full" />
											<SkeletonText style={{ width: legendWidth }} />
										</div>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</TitledCard>

			<TitledCard title="오류" action=<span className="text-[13px] text-muted-foreground">실패한 횟수</span>>
				<ul className="divide-y">
					{Array.from({ length: PLACEHOLDER_ERROR_COUNT }, (_, index) => (
						<li key={index} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
							<div>
								<SkeletonText className="h-5 w-32" />
								<SkeletonText className="w-28 text-[13px]" />
							</div>
							<SkeletonText className="h-5 w-8" />
						</li>
					))}
				</ul>
			</TitledCard>
		</div>
	);
};

export default WithdrawalDashboardSkeleton;

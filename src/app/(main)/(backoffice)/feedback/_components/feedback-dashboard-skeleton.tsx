import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { FEEDBACK_FILTER_LABELS } from '@/config/feedback-filters';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

// 그룹 제목 및 범례 글자의 폭
const PLACEHOLDER_GROUPS = [
	{ title: FEEDBACK_FILTER_LABELS.app_version, legendWidths: [60, 60, 60] },
	{ title: FEEDBACK_FILTER_LABELS.platform, legendWidths: [76, 104] },
	{ title: FEEDBACK_FILTER_LABELS.locale, legendWidths: [68, 76] },
];

/** 피드백 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const FeedbackDashboardSkeleton = () => {
	return (
		<>
			<TitledCard title="피드백 추이">
				<SkeletonText className="w-30 text-[44px] leading-[1.1]" />
				<SkeletonText className="mt-1.5 w-38 text-[13px]" />
				<Skeleton className="mt-3.5 h-38" />
				<dl className="mt-3.5 grid grid-cols-2 gap-2">
					<StatCell label="하루 평균">
						<SkeletonText className="w-12" />
					</StatCell>
					<StatCell label="작성자">
						<SkeletonText className="w-12" />
					</StatCell>
				</dl>
			</TitledCard>

			<TitledCard title="구성">
				<div className="grid gap-4.5">
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
		</>
	);
};

export default FeedbackDashboardSkeleton;

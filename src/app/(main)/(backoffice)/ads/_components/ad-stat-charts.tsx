import { type AdKind, type AdTotalStat, adEventKindSchema } from '@/types/apis/ads';
import type { DashboardParams } from '@/types/apis/dashboard';

import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import { AD_EVENT_KINDS, AD_KINDS } from '@/config/ad';
import { addDays, countDays, formatDate } from '@/utils/date';

interface Props {
	stats: AdTotalStat[];
	adKinds: AdKind[];
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 광고 종류별로 쌓은 일별 노출 수 및 클릭 수 그래프 컴포넌트
 * @param stats 광고 종류가 있는 일 단위 광고 통계
 * @param adKinds 아래부터 쌓을 광고 종류
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const AdStatCharts = ({ stats, adKinds, dashboardParams, today }: Props) => {
	const dates = Array.from({ length: countDays(dashboardParams.date_from, dashboardParams.date_to) }, (_, index) =>
		addDays(dashboardParams.date_from, index),
	);
	const series = adKinds.map((adKind) => ({
		dataKey: adKind,
		name: AD_KINDS[adKind].label,
		color: AD_KINDS[adKind].color,
	}));

	return (
		<div className="grid gap-4.5">
			{adEventKindSchema.options.map((kind) => {
				const eventStats = stats.filter((stat) => stat.kind === kind);
				// 이벤트가 없는 날짜는 0
				const daily = dates.map((date) => ({
					date,
					...Object.fromEntries(
						adKinds.map((adKind) => [
							adKind,
							eventStats.find((stat) => stat.ad_kind === adKind && formatDate(stat.started_at) === date)
								?.count ?? 0,
						]),
					),
				}));
				const totalCount = eventStats.reduce((sum, stat) => sum + stat.count, 0);

				return (
					<section key={kind} className="grid gap-2">
						<div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
							<h3 className="text-[13px] text-muted-foreground">{AD_EVENT_KINDS[kind]}</h3>

							<div className="flex flex-wrap items-baseline justify-end gap-x-3 gap-y-1">
								{/*광고 종류가 둘 이상이면 종류별 합계 표시*/}
								{adKinds.length > 1 &&
									adKinds.map((adKind) => (
										<span
											key={adKind}
											className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground"
										>
											<span
												className="size-2 rounded-full"
												style={{ backgroundColor: AD_KINDS[adKind].color }}
											/>
											{AD_KINDS[adKind].label}
											<b className="font-bold text-foreground tabular-nums">
												{eventStats
													.filter((stat) => stat.ad_kind === adKind)
													.reduce((sum, stat) => sum + stat.count, 0)
													.toLocaleString('ko-KR')}
											</b>
										</span>
									))}

								<strong className="font-bold tabular-nums">
									{totalCount.toLocaleString('ko-KR')}
									<span className="ml-0.5 text-[13px] font-semibold text-muted-foreground">회</span>
								</strong>
							</div>
						</div>

						<DailyCountChart
							daily={daily}
							title={`일별 ${AD_EVENT_KINDS[kind]} 수`}
							series={series}
							unit="회"
							highlightedDate={today}
							today={today}
						/>
					</section>
				);
			})}
		</div>
	);
};

export default AdStatCharts;

'use client';

import { platformSchema } from '@/types/apis/app-updates';
import type { Consent } from '@/types/apis/consents';
import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetConsentDashboard } from '@/hooks/apis/dashboard';

import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import HalfDonutChart from '@/app/(main)/(backoffice)/_components/half-donut-chart';
import RatioBarRow from '@/app/(main)/(backoffice)/_components/ratio-bar-row';
import { toLocaleName } from '@/utils/locale';
import { toPlatformName } from '@/utils/platform';

const SMALL_PART_MIN_ANGLE = 10;

const sectionClassName = 'min-w-0 px-4 pt-3.5 pb-4';
const sectionTitleClassName = 'text-[13px] font-semibold';

/** 인원을 전체 대비 비율 문구로 변환하는 함수 */
const formatPercent = (count: number, totalCount: number) => {
	const ratio = totalCount ? count / totalCount : 0;

	// 1%보다 작은 비율은 소수 첫째 자리까지 표시
	return ratio > 0 && ratio < 0.01 ? `${(ratio * 100).toFixed(1)}%` : `${Math.round(ratio * 100)}%`;
};

/** 동의한 인원의 비율을 정수로 반환하는 함수 */
const toGrantedPercent = ({ granted_count, user_count }: { granted_count: number; user_count: number }) => {
	return user_count ? Math.round((granted_count / user_count) * 100) : 0;
};

interface RateGroup {
	name: string;
	rows: { label: string; percent: number; barClassName?: string }[];
}

interface Props {
	consent: Consent;
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 게시 중인 버전의 동의 통계 컴포넌트
 * @param consent 게시 중인 버전
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const ConsentStats = ({ consent, dashboardParams, today }: Props) => {
	const { data: consentDashboardData } = useGetConsentDashboard({ id: consent.id, dashboardParams });

	const { users, decisions, daily, versions, platforms, locales } = consentDashboardData;

	// 인원이 없는 계열은 제외
	const decisionParts = [
		{ name: '동의', count: decisions.granted_count, color: 'var(--chart-2)' },
		{ name: '거부', count: decisions.denied_count, color: 'var(--chart-neutral)' },
		{ name: '접속 후 미응답', count: decisions.waiting_count, color: 'var(--warning-dot)' },
		{
			name: '접속 없음',
			count: users.total_count - decisions.granted_count - decisions.denied_count - decisions.waiting_count,
			color: 'var(--muted)',
		},
	].filter((decisionPart) => decisionPart.count > 0);

	const deniedExists = daily.some((dailyDecision) => dailyDecision.denied_count > 0);

	const rateGroups: RateGroup[] = [
		{
			name: '버전',
			rows: versions.map((versionDecision) => ({
				label: `버전 ${versionDecision.version}`,
				percent: toGrantedPercent(versionDecision),
				// 고른 버전만 강조
				barClassName: versionDecision.version === consent.version ? undefined : 'bg-chart-neutral',
			})),
		},
		{
			name: '기기',
			rows: platformSchema.options.flatMap((platform) =>
				platforms
					.filter((platformDecision) => platformDecision.platform === platform)
					.map((platformDecision) => ({
						label: toPlatformName(platform),
						percent: toGrantedPercent(platformDecision),
					})),
			),
		},
		{
			name: '언어',
			rows: ['ko-KR', 'en-US'].flatMap((locale) =>
				locales
					.filter((localeDecision) => localeDecision.locale === locale)
					.map((localeDecision) => ({
						label: toLocaleName(locale),
						percent: toGrantedPercent(localeDecision),
					})),
			),
		},
	];

	return (
		<div className="mt-4 grid rounded-lg border md:grid-cols-[264px_minmax(0,1fr)]">
			<section className={sectionClassName}>
				<h4 className={`${sectionTitleClassName} mb-2.5`}>동의 현황</h4>

				<HalfDonutChart
					title="동의 현황"
					parts={decisionParts}
					value={formatPercent(decisions.granted_count, users.total_count)}
					label="동의"
					unit="명"
					minAngle={SMALL_PART_MIN_ANGLE}
				/>

				<ul className="mt-3 divide-y text-[13px] tabular-nums">
					{decisionParts.map((decisionPart) => (
						<li key={decisionPart.name} className="flex items-center gap-2 py-1.5">
							<span
								className="size-2 shrink-0 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_12%,transparent)]"
								style={{ backgroundColor: decisionPart.color }}
							/>
							{decisionPart.name}
							<strong className="ml-auto font-bold">
								{decisionPart.count.toLocaleString('ko-KR')}명
							</strong>
							<span className="w-9 text-right text-muted-foreground">
								{formatPercent(decisionPart.count, users.total_count)}
							</span>
						</li>
					))}

					<li className="flex items-center gap-2 py-1.5">
						전체
						<strong className="mr-11 ml-auto font-bold">
							{users.total_count.toLocaleString('ko-KR')}명
						</strong>
					</li>
				</ul>
			</section>

			<div className="grid grid-cols-[minmax(0,1fr)] content-start max-md:border-t md:border-l">
				<section className={sectionClassName}>
					<div className="mb-2.5 flex items-baseline justify-between gap-3">
						<h4 className={sectionTitleClassName}>동의 추이</h4>
						<p className="text-[12.5px] text-muted-foreground">최근 {daily.length}일</p>
					</div>

					<DailyCountChart
						daily={daily}
						title="일별 동의 수"
						series={[
							{ dataKey: 'granted_count', name: '동의', color: 'var(--chart-2)' },
							// 조회 기간에 거부가 없으면 제외
							...(deniedExists
								? [{ dataKey: 'denied_count', name: '거부', color: 'var(--chart-neutral)' }]
								: []),
						]}
						unit="명"
						highlightedDate={today}
						today={today}
						lastValueDataKey="granted_count"
					/>
				</section>

				<section className={`${sectionClassName} border-t`}>
					<h4 className={`${sectionTitleClassName} mb-2.5`}>동의율</h4>

					<div className="grid grid-cols-[repeat(auto-fit,minmax(132px,1fr))] gap-x-6 gap-y-3">
						{rateGroups.map((rateGroup) => (
							<div key={rateGroup.name}>
								<h5 className="mb-1.5 text-[12.5px] text-muted-foreground">{rateGroup.name}</h5>

								<ul className="grid gap-1.5">
									{rateGroup.rows.map((row) => (
										<RatioBarRow
											key={row.label}
											label={row.label}
											barPercent={row.percent}
											percent={row.percent}
											barClassName={row.barClassName}
											className="grid-cols-[52px_minmax(0,1fr)_36px] gap-2 text-[13px]"
										/>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default ConsentStats;

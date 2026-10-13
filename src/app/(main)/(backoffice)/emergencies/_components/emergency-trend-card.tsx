'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { EmergencyDashboard } from '@/types/apis/dashboard';
import { emergencyKindSchema } from '@/types/apis/emergencies';

import type { SearchParamValue } from '@/lib/api';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { EMERGENCY_KINDS } from '@/config/emergency';
import { toEmergencyKindCounts } from '@/utils/emergency';
import { toToggledQuery, toUrlSearchParams } from '@/utils/search-params';

interface Props {
	emergencyDashboard: EmergencyDashboard;
	selectedDate?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 응급 상황 추이 카드 컴포넌트
 * @param emergencyDashboard 응급 상황 대시보드 집계
 * @param selectedDate 목록에 표시할 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const EmergencyTrendCard = ({ emergencyDashboard, selectedDate, query, today }: Props) => {
	const router = useRouter();

	const { emergencies, daily } = emergencyDashboard;
	const kindCounts = toEmergencyKindCounts(emergencies);

	const handleToggleDate = (date: string) => {
		router.push(`/emergencies?${toUrlSearchParams(toToggledQuery(query, 'date', date))}`, { scroll: false });
	};

	return (
		<TitledCard
			title="응급 상황 추이"
			action={
				// 종류를 누르면 목록을 그 종류로 조회
				<ul className="-my-0.5 flex gap-0.5 text-[13px] text-muted-foreground">
					{emergencyKindSchema.options.map((kind) => (
						<li key={kind}>
							<Link
								href={{ pathname: '/emergencies', query: toToggledQuery(query, 'kind', kind) }}
								scroll={false}
								aria-current={query.kind === kind ? 'true' : undefined}
								className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 hover:bg-muted aria-[current]:bg-muted"
							>
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: EMERGENCY_KINDS[kind].color }}
								/>
								{EMERGENCY_KINDS[kind].label}
								<b className="font-bold text-foreground tabular-nums">
									{kindCounts[kind].toLocaleString('ko-KR')}
								</b>
							</Link>
						</li>
					))}
				</ul>
			}
		>
			<p className="text-[44px] leading-[1.1] font-bold tracking-[-0.025em] whitespace-nowrap">
				{emergencies.count.toLocaleString('ko-KR')}
				<span className="ml-0.5 text-lg font-semibold tracking-normal text-muted-foreground">건</span>
			</p>

			<div className="mt-1.5">
				<CountChange
					count={emergencies.count}
					previousCount={emergencies.previous_count}
					dayCount={daily.length}
					unit="건"
				/>
			</div>

			<div className="mt-3.5">
				{/*선택한 날짜, 없으면 오늘만 진하게 표시*/}
				<DailyCountChart
					daily={daily}
					title="일별 응급 상황 수"
					series={[
						{
							dataKey: 'sound_count',
							name: EMERGENCY_KINDS.sound_emergency_detected.label,
							color: EMERGENCY_KINDS.sound_emergency_detected.color,
						},
						{
							dataKey: 'vision_count',
							name: EMERGENCY_KINDS.parrot_disappeared.label,
							color: EMERGENCY_KINDS.parrot_disappeared.color,
						},
					]}
					unit="건"
					highlightedDate={selectedDate ?? today}
					today={today}
					onSelectDate={handleToggleDate}
				/>
			</div>
		</TitledCard>
	);
};

export default EmergencyTrendCard;

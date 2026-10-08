import type { WithdrawalDashboard } from '@/types/apis/dashboard';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

interface Props {
	withdrawalDashboard: WithdrawalDashboard;
	today: string;
}

/**
 * 탈퇴 추이 카드 컴포넌트
 * @param withdrawalDashboard 탈퇴 대시보드 집계
 * @param today 오늘 날짜
 */
const WithdrawalTrendCard = ({ withdrawalDashboard, today }: Props) => {
	const { withdrawals, signup_count, daily } = withdrawalDashboard;

	return (
		<TitledCard title="탈퇴 추이">
			<p className="text-[44px] leading-[1.1] font-bold tracking-[-0.025em] whitespace-nowrap">
				{withdrawals.count.toLocaleString('ko-KR')}
				<span className="ml-0.5 text-lg font-semibold tracking-normal text-muted-foreground">명</span>
			</p>

			<div className="mt-1.5">
				<CountChange
					count={withdrawals.count}
					previousCount={withdrawals.previous_count}
					dayCount={daily.length}
					unit="명"
				/>
			</div>

			<div className="mt-3.5">
				<DailyCountChart
					daily={daily}
					title="일별 탈퇴 수"
					series={[{ dataKey: 'count', name: '탈퇴', color: 'var(--chart-2)' }]}
					unit="명"
					highlightedDate={today}
					today={today}
				/>
			</div>

			<dl className="mt-3.5 grid grid-cols-2 gap-2">
				<StatCell label="하루 평균">{(withdrawals.count / daily.length).toFixed(1)}명</StatCell>
				<StatCell label="가입">{signup_count.toLocaleString('ko-KR')}명</StatCell>
			</dl>
		</TitledCard>
	);
};

export default WithdrawalTrendCard;

import type { UserDashboard } from '@/types/apis/dashboard';

import ActiveUserTrends from '@/app/(main)/(backoffice)/_components/active-user-trends';
import CountryList from '@/app/(main)/(backoffice)/_components/country-list';

import { Card, CardTitle } from '@/components/ui/card';

interface Props {
	daily: UserDashboard['daily'];
	countries: UserDashboard['countries'];
	today: string;
}

/**
 * 기준별 활성 사용자 및 국가 카드 컴포넌트
 * @param daily 날짜별 사용자 집계
 * @param countries 국가별 접속 사용자 수
 * @param today 오늘 날짜
 */
const ActiveUserCard = ({ daily, countries, today }: Props) => {
	return (
		<Card className="grid gap-0 py-0 xl:col-span-2 xl:row-span-2 xl:grid-cols-[minmax(0,1fr)_268px]">
			<div className="min-w-0 px-5 py-4.5">
				<div className="mb-3.5 flex items-baseline justify-between gap-3">
					<CardTitle className="font-bold">활성 사용자</CardTitle>
					<p className="text-[13px] text-muted-foreground">접속 기준</p>
				</div>

				<ActiveUserTrends
					daily={daily}
					metrics={['dau', 'wau', 'mau', 'running_user_count']}
					chartHeight={112}
					today={today}
				/>
			</div>

			<div className="border-t bg-card-inset px-5 py-4.5 xl:border-t-0 xl:border-l">
				<CardTitle className="mb-3 font-bold">국가</CardTitle>

				<CountryList countries={countries} className="divide-y [&>li:first-child]:pt-0" />
			</div>
		</Card>
	);
};

export default ActiveUserCard;

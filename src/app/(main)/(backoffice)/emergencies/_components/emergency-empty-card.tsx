'use client';

import Link from 'next/link';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetEmergencyDashboard } from '@/hooks/apis/dashboard';

import { Check } from 'lucide-react';

import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';

import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
	dashboardParams: DashboardParams;
}

/**
 * 조회 기간에 응급 상황이 없을 때 표시하는 카드 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 */
const EmergencyEmptyCard = ({ dashboardParams }: Props) => {
	const { data: emergencyDashboardData } = useGetEmergencyDashboard(dashboardParams);

	return (
		<Card className="grid justify-items-center gap-2.5 px-4 pt-11 pb-9 text-center">
			<span className="grid size-7 place-items-center rounded-full bg-success/10 text-success">
				<Check aria-hidden className="size-4" strokeWidth={2} />
			</span>
			<strong className="text-base font-bold">이 기간에 응급 상황이 없습니다</strong>

			<dl className="my-1.5 grid w-full max-w-85 grid-cols-2 gap-2 text-left">
				<StatCell label="세션">{emergencyDashboardData.session_count.toLocaleString('ko-KR')}개</StatCell>
				<StatCell label="분석한 소리">
					{emergencyDashboardData.analyzed_sound_count.toLocaleString('ko-KR')}개
				</StatCell>
			</dl>

			<Link
				href={{ pathname: '/emergencies', query: { period: 90 } }}
				scroll={false}
				className={buttonVariants({ variant: 'outline' })}
			>
				최근 90일 보기
			</Link>
		</Card>
	);
};

export default EmergencyEmptyCard;

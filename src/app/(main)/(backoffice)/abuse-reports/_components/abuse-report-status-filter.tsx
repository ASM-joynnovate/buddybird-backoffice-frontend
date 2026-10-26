'use client';

import { useGetDashboardLive } from '@/hooks/apis/dashboard';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';

interface Props {
	handled: boolean;
}

/**
 * 처리 전 및 처리 완료 신고를 선택하는 버튼 그룹 컴포넌트
 * @param handled 처리 완료 신고 선택 여부
 */
const AbuseReportStatusFilter = ({ handled }: Props) => {
	const { data: dashboardLiveData } = useGetDashboardLive();

	const unhandledCount = dashboardLiveData.abuse_reports.unhandled_count;

	return (
		<SegmentedControl
			label="처리 상태"
			options={[
				{
					value: false,
					label: (
						<>
							처리 전
							{unhandledCount > 0 && <strong className="font-bold tabular-nums">{unhandledCount}</strong>}
						</>
					),
					href: '/abuse-reports',
				},
				{ value: true, label: '처리 완료', href: { pathname: '/abuse-reports', query: { handled: true } } },
			]}
			value={handled}
		/>
	);
};

export default AbuseReportStatusFilter;

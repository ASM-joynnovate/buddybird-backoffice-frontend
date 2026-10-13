'use client';

import type { EmergencyListParams } from '@/types/apis/emergencies';

import { useGetEmergencyList } from '@/hooks/apis/emergencies';

interface Props {
	listParams: EmergencyListParams;
}

/**
 * 조건에 맞는 응급 상황 건수 컴포넌트
 * @param listParams 목록 조회 조건
 */
const EmergencyResultCount = ({ listParams }: Props) => {
	const { data: emergencyListData } = useGetEmergencyList(listParams);

	return (
		<span className="text-[13px] font-semibold whitespace-nowrap tabular-nums">
			{emergencyListData.meta.total_count.toLocaleString('ko-KR')}건
		</span>
	);
};

export default EmergencyResultCount;

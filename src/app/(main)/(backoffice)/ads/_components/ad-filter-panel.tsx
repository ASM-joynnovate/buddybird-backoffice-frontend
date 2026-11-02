'use client';

import { adKindSchema, adStatusSchema } from '@/types/apis/ads';
import type { DashboardParams } from '@/types/apis/dashboard';

import type { FilterGroup } from '@/types/filter';

import { useGetUserDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CountryFlag from '@/app/(main)/(backoffice)/_components/country-flag';
import FilterPanel from '@/app/(main)/(backoffice)/_components/filter-panel';
import AdStatusIcon from '@/app/(main)/(backoffice)/ads/_components/ad-status-icon';
import { AD_FILTER_LABELS, AD_KINDS, AD_STATUSES, AD_TYPES } from '@/config/ad';
import { toCountryName } from '@/utils/country';

interface Props {
	dashboardParams: DashboardParams;
	query: Record<string, SearchParamValue>;
}

/**
 * 광고 필터 패널 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param query 현재 주소의 쿼리
 */
const AdFilterPanel = ({ dashboardParams, query }: Props) => {
	const { data: userDashboardData } = useGetUserDashboard(dashboardParams);

	const filterGroups: FilterGroup[] = [
		{
			name: 'kind',
			label: AD_FILTER_LABELS.kind,
			options: adKindSchema.options.map((kind) => ({ value: kind, label: AD_KINDS[kind].label })),
		},
		{
			name: 'status',
			label: AD_FILTER_LABELS.status,
			options: adStatusSchema.options.map((status) => ({
				value: status,
				label: AD_STATUSES[status],
				icon: <AdStatusIcon status={status} className="size-3.5" />,
			})),
		},
		{
			name: 'is_ad',
			label: AD_FILTER_LABELS.is_ad,
			options: [
				{ value: true, label: AD_TYPES.ad },
				{ value: false, label: AD_TYPES.info },
			],
		},
		{
			name: 'country',
			label: AD_FILTER_LABELS.country,
			// 사용자가 있는 프로필 국가
			options: userDashboardData.countries.flatMap(({ country }) =>
				country
					? [
							{
								value: country,
								label: toCountryName(country),
								icon: <CountryFlag country={country} className="w-4" />,
							},
						]
					: [],
			),
		},
	];

	return (
		<FilterPanel pathname="/ads" query={query} filterGroups={filterGroups} className="md:w-[min(560px,100cqw)]" />
	);
};

export default AdFilterPanel;

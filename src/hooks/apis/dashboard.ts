import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import {
	getDashboard,
	getDashboardLive,
	getFeedbackDashboard,
	getNotificationDashboard,
	getUserDashboard,
	getWithdrawalDashboard,
} from '@/apis/dashboard';

import type { DashboardParams } from '@/types/apis/dashboard';

import { apiKeys } from '@/hooks/apis/keys';

import { DASHBOARD_LIVE_REFETCH_INTERVAL_MS } from '@/config';

/** 대시보드 조회 Hook에 사용할 옵션 */
export const getDashboardOptions = (dashboardParams: DashboardParams) =>
	queryOptions({
		queryKey: apiKeys.dashboard.detail(dashboardParams),
		queryFn: () => getDashboard(dashboardParams),
	});
/** 대시보드 조회 Hook */
export const useGetDashboard = (dashboardParams: DashboardParams) => {
	return useSuspenseQuery(getDashboardOptions(dashboardParams));
};

/** 대시보드 현재 상태 조회 Hook에 사용할 옵션 */
export const getDashboardLiveOptions = () =>
	queryOptions({
		queryKey: apiKeys.dashboard.live(),
		queryFn: getDashboardLive,
		refetchInterval: DASHBOARD_LIVE_REFETCH_INTERVAL_MS,
	});
/** 대시보드 현재 상태 조회 Hook */
export const useGetDashboardLive = () => {
	return useSuspenseQuery(getDashboardLiveOptions());
};

/** 사용자 대시보드 조회 Hook에 사용할 옵션 */
export const getUserDashboardOptions = (dashboardParams: DashboardParams) =>
	queryOptions({
		queryKey: apiKeys.dashboard.users(dashboardParams),
		queryFn: () => getUserDashboard(dashboardParams),
	});
/** 사용자 대시보드 조회 Hook */
export const useGetUserDashboard = (dashboardParams: DashboardParams) => {
	return useSuspenseQuery(getUserDashboardOptions(dashboardParams));
};

/** 피드백 대시보드 조회 Hook에 사용할 옵션 */
export const getFeedbackDashboardOptions = (dashboardParams: DashboardParams) =>
	queryOptions({
		queryKey: apiKeys.dashboard.feedback(dashboardParams),
		queryFn: () => getFeedbackDashboard(dashboardParams),
	});
/** 피드백 대시보드 조회 Hook */
export const useGetFeedbackDashboard = (dashboardParams: DashboardParams) => {
	return useSuspenseQuery(getFeedbackDashboardOptions(dashboardParams));
};

/** 알림 대시보드 조회 Hook에 사용할 옵션 */
export const getNotificationDashboardOptions = (dashboardParams: DashboardParams) =>
	queryOptions({
		queryKey: apiKeys.dashboard.notifications(dashboardParams),
		queryFn: () => getNotificationDashboard(dashboardParams),
	});
/** 알림 대시보드 조회 Hook */
export const useGetNotificationDashboard = (dashboardParams: DashboardParams) => {
	return useSuspenseQuery(getNotificationDashboardOptions(dashboardParams));
};

/** 탈퇴 대시보드 조회 Hook에 사용할 옵션 */
export const getWithdrawalDashboardOptions = (dashboardParams: DashboardParams) =>
	queryOptions({
		queryKey: apiKeys.dashboard.withdrawals(dashboardParams),
		queryFn: () => getWithdrawalDashboard(dashboardParams),
	});
/** 탈퇴 대시보드 조회 Hook */
export const useGetWithdrawalDashboard = (dashboardParams: DashboardParams) => {
	return useSuspenseQuery(getWithdrawalDashboardOptions(dashboardParams));
};

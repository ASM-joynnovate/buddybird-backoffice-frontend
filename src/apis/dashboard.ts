import {
	type Dashboard,
	type DashboardLive,
	dashboardLiveSchema,
	type DashboardParams,
	dashboardSchema,
	type UserDashboard,
	userDashboardSchema,
} from '@/types/apis/dashboard';

import { apiRequest } from '@/lib/api';

export const getDashboard = async ({ date_from, date_to }: DashboardParams): Promise<Dashboard> => {
	const { data: dashboard } = await apiRequest('/api/v1/backoffice/dashboard', dashboardSchema, {
		searchParams: { date_from, date_to },
	});

	return dashboard;
};

export const getDashboardLive = async (): Promise<DashboardLive> => {
	const { data: dashboardLive } = await apiRequest('/api/v1/backoffice/dashboard/live', dashboardLiveSchema);

	return dashboardLive;
};

export const getUserDashboard = async ({ date_from, date_to }: DashboardParams): Promise<UserDashboard> => {
	const { data: userDashboard } = await apiRequest('/api/v1/backoffice/dashboard/users', userDashboardSchema, {
		searchParams: { date_from, date_to },
	});

	return userDashboard;
};

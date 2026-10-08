import type { Platform } from '@/types/apis/app-updates';
import {
	type AppUpdateDashboard,
	appUpdateDashboardSchema,
	type ConsentDashboard,
	consentDashboardSchema,
	type Dashboard,
	type DashboardLive,
	dashboardLiveSchema,
	type DashboardParams,
	dashboardSchema,
	type FeedbackDashboard,
	feedbackDashboardSchema,
	type NotificationDashboard,
	notificationDashboardSchema,
	type UserDashboard,
	userDashboardSchema,
	type WithdrawalDashboard,
	withdrawalDashboardSchema,
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

export const getFeedbackDashboard = async ({ date_from, date_to }: DashboardParams): Promise<FeedbackDashboard> => {
	const { data: feedbackDashboard } = await apiRequest(
		'/api/v1/backoffice/dashboard/feedback',
		feedbackDashboardSchema,
		{ searchParams: { date_from, date_to } },
	);

	return feedbackDashboard;
};

export const getNotificationDashboard = async ({
	date_from,
	date_to,
}: DashboardParams): Promise<NotificationDashboard> => {
	const { data: notificationDashboard } = await apiRequest(
		'/api/v1/backoffice/dashboard/notifications',
		notificationDashboardSchema,
		{ searchParams: { date_from, date_to } },
	);

	return notificationDashboard;
};

export const getWithdrawalDashboard = async ({ date_from, date_to }: DashboardParams): Promise<WithdrawalDashboard> => {
	const { data: withdrawalDashboard } = await apiRequest(
		'/api/v1/backoffice/dashboard/withdrawals',
		withdrawalDashboardSchema,
		{ searchParams: { date_from, date_to } },
	);

	return withdrawalDashboard;
};

export const getAppUpdateDashboard = async ({ platform }: { platform: Platform }): Promise<AppUpdateDashboard> => {
	const { data: appUpdateDashboard } = await apiRequest(
		'/api/v1/backoffice/dashboard/app-updates',
		appUpdateDashboardSchema,
		{ searchParams: { platform } },
	);

	return appUpdateDashboard;
};

export const getConsentDashboard = async ({
	id,
	dashboardParams: { date_from, date_to },
}: {
	id: string;
	dashboardParams: DashboardParams;
}): Promise<ConsentDashboard> => {
	const { data: consentDashboard } = await apiRequest(
		`/api/v1/backoffice/dashboard/consents/${id}`,
		consentDashboardSchema,
		{ searchParams: { date_from, date_to } },
	);

	return consentDashboard;
};

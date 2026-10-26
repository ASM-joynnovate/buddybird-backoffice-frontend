import type { AbuseReportListParams } from '@/types/apis/abuse-reports';
import type { AnnouncementListParams } from '@/types/apis/announcements';
import type { Platform } from '@/types/apis/app-updates';
import type { DashboardParams, StabilityIssueFilters, StabilityIssueSort } from '@/types/apis/dashboard';
import type { EmergencyListParams } from '@/types/apis/emergencies';
import type { FeedbackListParams } from '@/types/apis/feedback';
import type {
	NotificationDispatchListParams,
	NotificationListParams,
	PushDeliveryListParams,
	SendableNotificationKind,
} from '@/types/apis/notifications';
import type { SessionEventListParams, SessionSoundListParams } from '@/types/apis/sessions';
import type { UserListParams, UserSessionListParams } from '@/types/apis/users';
import type { WithdrawalListParams } from '@/types/apis/withdrawals';

export const apiKeys = {
	dashboard: {
		all: () => ['api', 'dashboard'] as const,
		detail: (dashboardParams: DashboardParams) => ['api', 'dashboard', dashboardParams] as const,
		live: () => ['api', 'dashboard', 'live'] as const,
		users: (dashboardParams: DashboardParams) => ['api', 'dashboard', 'users', dashboardParams] as const,
		feedback: (dashboardParams: DashboardParams) => ['api', 'dashboard', 'feedback', dashboardParams] as const,
		emergencies: (dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'emergencies', dashboardParams] as const,
		withdrawals: (dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'withdrawals', dashboardParams] as const,
		notifications: (dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'notifications', dashboardParams] as const,
		analytics: (dashboardParams: DashboardParams) => ['api', 'dashboard', 'analytics', dashboardParams] as const,
		stability: (dashboardParams: DashboardParams, sort: StabilityIssueSort, issueFilters: StabilityIssueFilters) =>
			['api', 'dashboard', 'stability', dashboardParams, sort, issueFilters] as const,
		appUpdates: (platform: Platform) => ['api', 'dashboard', 'app-updates', platform] as const,
		consents: (id: string, dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'consents', id, dashboardParams] as const,
	},
	users: {
		all: () => ['api', 'users'] as const,
		list: (listParams: UserListParams) => ['api', 'users', 'list', listParams] as const,
		infiniteList: (listParams: Omit<UserListParams, 'page'>) =>
			['api', 'users', 'infinite-list', listParams] as const,
		detail: (id: string) => ['api', 'users', id] as const,
		sessionList: (id: string, listParams: UserSessionListParams) =>
			['api', 'users', id, 'sessions', listParams] as const,
		wordList: (id: string) => ['api', 'users', id, 'words'] as const,
		consentList: (id: string) => ['api', 'users', id, 'consents'] as const,
		notificationSettings: (id: string) => ['api', 'users', id, 'settings', 'notifications'] as const,
	},
	sessions: {
		detail: (id: string) => ['api', 'sessions', id] as const,
		eventList: (id: string, listParams: SessionEventListParams) =>
			['api', 'sessions', id, 'events', listParams] as const,
		event: (id: string, eventId: string) => ['api', 'sessions', id, 'events', eventId] as const,
		soundList: (id: string, listParams: SessionSoundListParams) =>
			['api', 'sessions', id, 'sounds', listParams] as const,
		sound: (id: string, soundId: string) => ['api', 'sessions', id, 'sounds', soundId] as const,
	},
	announcements: {
		all: () => ['api', 'announcements'] as const,
		list: (listParams: AnnouncementListParams) => ['api', 'announcements', 'list', listParams] as const,
	},
	consents: {
		all: () => ['api', 'consents'] as const,
	},
	appUpdates: {
		all: () => ['api', 'app-updates'] as const,
		list: (platform: Platform) => ['api', 'app-updates', 'list', platform] as const,
	},
	feedback: {
		list: (listParams: FeedbackListParams) => ['api', 'feedback', 'list', listParams] as const,
	},
	emergencies: {
		all: () => ['api', 'emergencies'] as const,
		list: (listParams: EmergencyListParams) => ['api', 'emergencies', 'list', listParams] as const,
	},
	notifications: {
		all: () => ['api', 'notifications'] as const,
		list: (listParams: NotificationListParams) => ['api', 'notifications', 'list', listParams] as const,
		deliveryList: (listParams: PushDeliveryListParams) =>
			['api', 'notifications', 'deliveries', listParams] as const,
		dispatchList: (listParams: NotificationDispatchListParams) =>
			['api', 'notifications', 'dispatches', 'list', listParams] as const,
		dispatchDetail: (id: string) => ['api', 'notifications', 'dispatches', id] as const,
		audience: (kind: SendableNotificationKind) => ['api', 'notifications', 'audience', kind] as const,
	},
	notificationSettings: {
		all: () => ['api', 'notification-settings'] as const,
		groupList: () => ['api', 'notification-settings', 'groups'] as const,
		itemList: () => ['api', 'notification-settings', 'items'] as const,
	},
	presetWords: {
		all: () => ['api', 'preset-words'] as const,
	},
	abuseReports: {
		all: () => ['api', 'abuse-reports'] as const,
		list: (listParams: AbuseReportListParams) => ['api', 'abuse-reports', 'list', listParams] as const,
	},
	withdrawals: {
		all: () => ['api', 'withdrawals'] as const,
		list: (listParams: WithdrawalListParams) => ['api', 'withdrawals', 'list', listParams] as const,
	},
	mutation: (...parts: string[]) => ['api', ...parts] as const,
};

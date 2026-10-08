import type { AnnouncementListParams } from '@/types/apis/announcements';
import type { Platform } from '@/types/apis/app-updates';
import type { DashboardParams } from '@/types/apis/dashboard';
import type { FeedbackListParams } from '@/types/apis/feedback';
import type {
	NotificationDispatchListParams,
	NotificationListParams,
	PushDeliveryListParams,
	SendableNotificationKind,
} from '@/types/apis/notifications';
import type { UserListParams } from '@/types/apis/users';
import type { WithdrawalListParams } from '@/types/apis/withdrawals';

export const apiKeys = {
	dashboard: {
		detail: (dashboardParams: DashboardParams) => ['api', 'dashboard', dashboardParams] as const,
		live: () => ['api', 'dashboard', 'live'] as const,
		users: (dashboardParams: DashboardParams) => ['api', 'dashboard', 'users', dashboardParams] as const,
		feedback: (dashboardParams: DashboardParams) => ['api', 'dashboard', 'feedback', dashboardParams] as const,
		withdrawals: (dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'withdrawals', dashboardParams] as const,
		notifications: (dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'notifications', dashboardParams] as const,
		appUpdates: (platform: Platform) => ['api', 'dashboard', 'app-updates', platform] as const,
		consents: (id: string, dashboardParams: DashboardParams) =>
			['api', 'dashboard', 'consents', id, dashboardParams] as const,
	},
	users: {
		all: () => ['api', 'users'] as const,
		list: (listParams: UserListParams) => ['api', 'users', 'list', listParams] as const,
		detail: (id: string) => ['api', 'users', id] as const,
		sessionList: (id: string, page: number) => ['api', 'users', id, 'sessions', page] as const,
		wordList: (id: string) => ['api', 'users', id, 'words'] as const,
		consentList: (id: string) => ['api', 'users', id, 'consents'] as const,
	},
	sessions: {
		eventList: (id: string) => ['api', 'sessions', id, 'events'] as const,
		soundList: (id: string) => ['api', 'sessions', id, 'sounds'] as const,
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
	presetWords: {
		all: () => ['api', 'preset-words'] as const,
	},
	withdrawals: {
		all: () => ['api', 'withdrawals'] as const,
		list: (listParams: WithdrawalListParams) => ['api', 'withdrawals', 'list', listParams] as const,
	},
	mutation: (...parts: string[]) => ['api', ...parts] as const,
};

import type { Platform } from '@/types/apis/app-updates';
import type { NotificationListParams, PushDeliveryListParams } from '@/types/apis/notifications';
import type { UserListParams } from '@/types/apis/users';
import type { WithdrawalListParams } from '@/types/apis/withdrawals';

export const apiKeys = {
	users: {
		all: () => ['api', 'users'] as const,
		list: (listParams: UserListParams) => ['api', 'users', 'list', listParams] as const,
		detail: (id: string) => ['api', 'users', id] as const,
		sessionList: (id: string, page: number) => ['api', 'users', id, 'sessions', page] as const,
	},
	announcements: {
		all: () => ['api', 'announcements'] as const,
		list: (page: number) => ['api', 'announcements', 'list', page] as const,
	},
	consents: {
		all: () => ['api', 'consents'] as const,
	},
	appUpdates: {
		all: () => ['api', 'app-updates'] as const,
		detail: (platform: Platform) => ['api', 'app-updates', platform] as const,
	},
	feedback: {
		list: (page: number) => ['api', 'feedback', 'list', page] as const,
	},
	notifications: {
		all: () => ['api', 'notifications'] as const,
		list: (listParams: NotificationListParams) => ['api', 'notifications', 'list', listParams] as const,
		deliveryList: (listParams: PushDeliveryListParams) =>
			['api', 'notifications', 'deliveries', listParams] as const,
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

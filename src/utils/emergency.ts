import { platformSchema } from '@/types/apis/app-updates';
import type { EmergencyDashboard } from '@/types/apis/dashboard';
import { emergencyKindSchema, emergencyNotificationStateSchema } from '@/types/apis/emergencies';

import type { FilterGroup } from '@/types/filter';

import {
	EMERGENCY_FILTER_LABELS,
	EMERGENCY_KINDS,
	EMERGENCY_NOTIFICATION_STATES,
	EMERGENCY_STATES,
} from '@/config/emergency';
import { toPlatformName } from '@/utils/platform';

/** 응급 상황 종류별 건수를 반환하는 함수 */
export const toEmergencyKindCounts = ({ sound_count, vision_count }: EmergencyDashboard['emergencies']) => {
	return { sound_emergency_detected: sound_count, parrot_disappeared: vision_count };
};

/** 응급 상황 대시보드의 건수를 필터 그룹으로 변환하는 함수 */
export const toEmergencyFilterGroups = (emergencyDashboard: EmergencyDashboard): FilterGroup[] => {
	const { emergencies, ongoing_count, notifications, platforms } = emergencyDashboard;

	const kindCounts = toEmergencyKindCounts(emergencies);
	const notificationCounts = {
		read: notifications.read_count,
		unread: notifications.unread_count,
		none: notifications.none_count,
	};

	return [
		{
			name: 'kind',
			label: EMERGENCY_FILTER_LABELS.kind,
			allOption: { label: '전체', count: emergencies.count },
			options: emergencyKindSchema.options.map((kind) => ({
				value: kind,
				label: EMERGENCY_KINDS[kind].label,
				count: kindCounts[kind],
			})),
		},
		{
			name: 'is_ongoing',
			label: EMERGENCY_FILTER_LABELS.is_ongoing,
			options: [
				{ value: true, label: EMERGENCY_STATES.ongoing, count: ongoing_count },
				{ value: false, label: EMERGENCY_STATES.ended, count: emergencies.count - ongoing_count },
			],
		},
		{
			name: 'notification',
			label: EMERGENCY_FILTER_LABELS.notification,
			options: emergencyNotificationStateSchema.options.map((notificationState) => ({
				value: notificationState,
				label: EMERGENCY_NOTIFICATION_STATES[notificationState],
				count: notificationCounts[notificationState],
			})),
		},
		{
			name: 'platform',
			label: EMERGENCY_FILTER_LABELS.platform,
			options: platformSchema.options
				.flatMap((platform) => platforms.filter((platformCount) => platformCount.platform === platform))
				.map(({ platform, count }) => ({ value: platform, label: toPlatformName(platform), count })),
		},
	];
};

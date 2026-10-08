import type { SendableNotificationKind } from '@/types/apis/notifications';
import type { UserListItem } from '@/types/apis/users';

import { Ban, Bell, BellOff } from 'lucide-react';

import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import { receivesNotification } from '@/utils/notification';

interface Props {
	user: UserListItem;
	kind: SendableNotificationKind;
}

/**
 * 사용자에게 알림이 전달되는 방식의 아이콘 컴포넌트
 * @param user 받는 사용자
 * @param kind 보낼 알림 종류
 */
const NotificationReachIcon = ({ user, kind }: Props) => {
	if (!receivesNotification(user, kind)) {
		const label = `${NOTIFICATION_KINDS[kind].label} 알림 꺼짐`;

		return (
			<Ban aria-label={label} className="size-4">
				<title>{label}</title>
			</Ban>
		);
	}

	const label = user.is_pushable ? '푸시 가능' : '푸시 불가';
	const Icon = user.is_pushable ? Bell : BellOff;

	return (
		<Icon aria-label={label} className="size-4">
			<title>{label}</title>
		</Icon>
	);
};

export default NotificationReachIcon;

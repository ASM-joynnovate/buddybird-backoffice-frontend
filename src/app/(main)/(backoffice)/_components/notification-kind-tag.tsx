import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import { toNotificationKindDisplay } from '@/utils/notification';

interface Props {
	kind: string;
}

/**
 * 알림 종류 태그 컴포넌트
 * @param kind 알림 종류
 */
const NotificationKindTag = ({ kind }: Props) => {
	const { label, color } = toNotificationKindDisplay(kind);

	return <ColorTag color={color}>{label}</ColorTag>;
};

export default NotificationKindTag;

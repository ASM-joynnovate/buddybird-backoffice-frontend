'use client';

import type { NotificationSettingGroup } from '@/types/apis/notification-settings';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import NotificationSettingGroupRow from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-group-row';
import { placeholderRowClassName } from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-row';

interface Props {
	group: NotificationSettingGroup;
	dragDisabled: boolean;
	onOpen: () => void;
}

/**
 * 끌어서 옮길 수 있는 알림 설정 그룹 행 컴포넌트
 * @param group 표시할 그룹
 * @param dragDisabled 끌기를 막을지 여부
 * @param onOpen 행을 누르면 실행할 함수
 */
const SortableNotificationSettingGroupRow = ({ group, dragDisabled, onOpen }: Props) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: group.id,
		disabled: dragDisabled,
	});

	return (
		<NotificationSettingGroupRow
			ref={setNodeRef}
			group={group}
			style={{ transform: CSS.Translate.toString(transform), transition }}
			className={isDragging ? placeholderRowClassName : undefined}
			dragHandleProps={{ ref: setActivatorNodeRef, disabled: dragDisabled, ...attributes, ...listeners }}
			onOpen={onOpen}
		/>
	);
};

export default SortableNotificationSettingGroupRow;

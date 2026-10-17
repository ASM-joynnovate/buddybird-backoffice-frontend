'use client';

import type { NotificationSettingItem } from '@/types/apis/notification-settings';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import NotificationSettingItemRow, {
	placeholderRowClassName,
} from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-row';

interface Props {
	item: NotificationSettingItem;
	dragDisabled: boolean;
	onOpen: () => void;
}

/**
 * 끌어서 옮길 수 있는 알림 설정 항목 행 컴포넌트
 * @param item 표시할 항목
 * @param dragDisabled 끌기를 막을지 여부
 * @param onOpen 행을 누르면 실행할 함수
 */
const SortableNotificationSettingItemRow = ({ item, dragDisabled, onOpen }: Props) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id,
		disabled: dragDisabled,
	});

	return (
		<NotificationSettingItemRow
			ref={setNodeRef}
			item={item}
			grouped={!!item.group_id}
			style={{ transform: CSS.Translate.toString(transform), transition }}
			className={isDragging ? placeholderRowClassName : undefined}
			dragHandleProps={{ ref: setActivatorNodeRef, disabled: dragDisabled, ...attributes, ...listeners }}
			onOpen={onOpen}
		/>
	);
};

export default SortableNotificationSettingItemRow;

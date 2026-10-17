'use client';

import { Fragment, useId, useState } from 'react';

import type { NotificationSettingGroup, NotificationSettingItem } from '@/types/apis/notification-settings';

import {
	useGetNotificationSettingGroupList,
	useGetNotificationSettingItemList,
	useReorderNotificationSettingGroups,
	useReorderNotificationSettingItems,
} from '@/hooks/apis/notification-settings';

import { cn } from '@/lib/utils';

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AddNotificationSettingGroupButton from '@/app/(main)/(backoffice)/notification-settings/_components/add-notification-setting-group-button';
import AddNotificationSettingItemButton from '@/app/(main)/(backoffice)/notification-settings/_components/add-notification-setting-item-button';
import NotificationSettingGroupFormDialog from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-group-form-dialog';
import NotificationSettingGroupRow from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-group-row';
import NotificationSettingItemFormDialog from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-form-dialog';
import NotificationSettingItemRow, {
	notificationSettingGridClassName,
	notificationSettingRowClassName,
	overlayRowClassName,
} from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-row';
import SortableNotificationSettingGroupRow from '@/app/(main)/(backoffice)/notification-settings/_components/sortable-notification-setting-group-row';
import SortableNotificationSettingItemRow from '@/app/(main)/(backoffice)/notification-settings/_components/sortable-notification-setting-item-row';
import { DRAG_ANNOUNCEMENTS, DRAG_SCREEN_READER_INSTRUCTIONS } from '@/config/drag';

/** 알림 설정 "항목" 카드 컴포넌트 */
const NotificationSettingTableCard = () => {
	const { data: groupListData } = useGetNotificationSettingGroupList();
	const { data: itemListData } = useGetNotificationSettingItemList();

	const reorderGroups = useReorderNotificationSettingGroups();
	const reorderItems = useReorderNotificationSettingItems();

	const [draggingId, setDraggingId] = useState<string>();
	const [editingGroup, setEditingGroup] = useState<NotificationSettingGroup>();
	const [editingItem, setEditingItem] = useState<NotificationSettingItem>();

	const dndContextId = useId();
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const reordering = reorderGroups.isPending || reorderItems.isPending;

	// 순서 변경을 저장하는 동안 요청한 순서로 표시
	const groupOrder = reorderGroups.isPending ? reorderGroups.variables?.ids : undefined;
	const itemOrder = reorderItems.isPending ? reorderItems.variables?.data.items : undefined;
	const groups = groupOrder
		? groupListData.toSorted((a, b) => groupOrder.indexOf(a.id) - groupOrder.indexOf(b.id))
		: groupListData;
	const items = itemOrder
		? itemOrder.flatMap(({ id, group_id }) => {
				const item = itemListData.find((candidate) => candidate.id === id);

				return item ? [{ ...item, group_id }] : [];
			})
		: itemListData;

	const groupIds = groups.map((group) => group.id);
	const draggingGroup = groups.find((group) => group.id === draggingId);
	const draggingItem = items.find((item) => item.id === draggingId);

	/** 그룹에 속한 항목을 반환하는 함수 */
	const itemsOf = (groupId: string | null) => items.filter((item) => item.group_id === groupId);

	// 끄는 그룹의 항목은 제외
	const sortableIds = [
		...itemsOf(null).map((item) => item.id),
		...groups.flatMap((group) => [
			group.id,
			...(group.id === draggingId ? [] : itemsOf(group.id).map((item) => item.id)),
		]),
	];

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		setDraggingId(undefined);

		if (reordering || !over || active.id === over.id) {
			return;
		}

		const movedIds = arrayMove(
			sortableIds,
			sortableIds.indexOf(String(active.id)),
			sortableIds.indexOf(String(over.id)),
		);

		if (groupIds.includes(String(active.id))) {
			const nextGroupIds = movedIds.filter((id) => groupIds.includes(id));

			// 다른 그룹을 지나치지 않으면 순서가 그대로
			if (nextGroupIds.every((id, index) => id === groupIds[index])) {
				return;
			}

			reorderGroups.mutate({ ids: nextGroupIds });

			return;
		}

		// 항목은 위쪽에서 가장 가까운 그룹에 속함
		let groupId: string | null = null;
		const nextItems: { id: string; group_id: string | null }[] = [];

		for (const id of movedIds) {
			if (groupIds.includes(id)) {
				groupId = id;
			} else {
				nextItems.push({ id, group_id: groupId });
			}
		}

		reorderItems.mutate({ data: { items: nextItems } });
	};

	return (
		<>
			<TitledCard
				title="항목"
				action={
					items.length > 0 && (
						<span className="text-[13px] text-muted-foreground tabular-nums">{items.length}개</span>
					)
				}
			>
				{items.length === 0 && groups.length === 0 ? (
					<div className="grid justify-items-center gap-1.5 px-4 pt-7 pb-3.5 text-center">
						<strong className="text-base font-bold">등록된 알림 설정이 없습니다</strong>

						<div className="mt-2.5 flex gap-2">
							<AddNotificationSettingGroupButton />
							<AddNotificationSettingItemButton />
						</div>
					</div>
				) : (
					<>
						<div
							className={cn(
								notificationSettingGridClassName,
								'font-medium whitespace-nowrap text-muted-foreground max-md:hidden',
							)}
						>
							<span className="pb-2 [grid-area:title]">제목</span>
							<span className="pb-2 [grid-area:kind]">종류</span>
							<span className="pb-2 [grid-area:def]">기본값</span>
						</div>

						<DndContext
							id={dndContextId}
							accessibility={{
								screenReaderInstructions: DRAG_SCREEN_READER_INSTRUCTIONS,
								announcements: DRAG_ANNOUNCEMENTS,
							}}
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragStart={({ active }) => setDraggingId(String(active.id))}
							onDragEnd={handleDragEnd}
							onDragCancel={() => setDraggingId(undefined)}
						>
							<SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
								<ul>
									<li
										className={cn(
											notificationSettingGridClassName,
											notificationSettingRowClassName,
											'min-h-10 text-[12.5px] font-semibold text-muted-foreground max-md:first:before:hidden',
										)}
									>
										<span className="[grid-area:title]">미분류</span>
									</li>

									{itemsOf(null).map((item) => (
										<SortableNotificationSettingItemRow
											key={item.id}
											item={item}
											dragDisabled={reordering}
											onOpen={() => setEditingItem(item)}
										/>
									))}

									{groups.map((group) => (
										<Fragment key={group.id}>
											<SortableNotificationSettingGroupRow
												group={group}
												dragDisabled={reordering}
												onOpen={() => setEditingGroup(group)}
											/>

											{group.id !== draggingId &&
												itemsOf(group.id).map((item) => (
													<SortableNotificationSettingItemRow
														key={item.id}
														item={item}
														dragDisabled={reordering}
														onOpen={() => setEditingItem(item)}
													/>
												))}
										</Fragment>
									))}
								</ul>
							</SortableContext>

							{/*끄는 동안 포인터를 따라 움직이는 행*/}
							<DragOverlay>
								{!!draggingItem && (
									<ul>
										<NotificationSettingItemRow
											item={draggingItem}
											grouped={!!draggingItem.group_id}
											className={overlayRowClassName}
										/>
									</ul>
								)}

								{/*놓을 위치는 그룹 행 높이로 판정*/}
								{!!draggingGroup && (
									<div className="h-full">
										<ul className={cn('rounded-md', overlayRowClassName)}>
											<NotificationSettingGroupRow
												group={draggingGroup}
												className="mx-0 before:hidden"
											/>
											{itemsOf(draggingGroup.id).map((item) => (
												<NotificationSettingItemRow
													key={item.id}
													item={item}
													grouped
													className="mx-0"
												/>
											))}
										</ul>
									</div>
								)}
							</DragOverlay>
						</DndContext>
					</>
				)}
			</TitledCard>

			{/*목록이 바뀌어도 저장이 끝날 때까지 유지*/}
			{!!editingGroup && (
				<NotificationSettingGroupFormDialog group={editingGroup} onClose={() => setEditingGroup(undefined)} />
			)}
			{!!editingItem && (
				<NotificationSettingItemFormDialog item={editingItem} onClose={() => setEditingItem(undefined)} />
			)}
		</>
	);
};

export default NotificationSettingTableCard;

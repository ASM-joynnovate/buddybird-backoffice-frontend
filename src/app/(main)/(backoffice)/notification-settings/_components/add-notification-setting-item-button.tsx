'use client';

import { useState } from 'react';

import { notificationSettingKindSchema } from '@/types/apis/notification-settings';

import { useGetNotificationSettingItemList } from '@/hooks/apis/notification-settings';

import { Plus } from 'lucide-react';

import NotificationSettingItemFormDialog from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-form-dialog';

import { Button } from '@/components/ui/button';

/** 항목 추가 버튼 컴포넌트 */
const AddNotificationSettingItemButton = () => {
	const { data: itemListData } = useGetNotificationSettingItemList();

	const [formDialogOpen, setFormDialogOpen] = useState(false);

	const kindRemaining = itemListData.length < notificationSettingKindSchema.options.length;

	return (
		<>
			{kindRemaining && (
				<Button onClick={() => setFormDialogOpen(true)}>
					<Plus />
					항목 추가
				</Button>
			)}

			{/*저장 뒤 종류가 모두 등록돼도 닫을 때까지 유지*/}
			{formDialogOpen && <NotificationSettingItemFormDialog onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default AddNotificationSettingItemButton;

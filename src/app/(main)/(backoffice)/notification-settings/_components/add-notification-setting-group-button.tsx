'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import NotificationSettingGroupFormDialog from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-group-form-dialog';

import { Button } from '@/components/ui/button';

/** 그룹 추가 버튼 컴포넌트 */
const AddNotificationSettingGroupButton = () => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<Button variant="outline" onClick={() => setFormDialogOpen(true)}>
				<Plus />
				그룹 추가
			</Button>

			{formDialogOpen && <NotificationSettingGroupFormDialog onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default AddNotificationSettingGroupButton;

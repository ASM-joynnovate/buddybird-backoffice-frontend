'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import AnnouncementFormDialog from '@/app/(main)/(backoffice)/announcements/_components/announcement-form-dialog';

import { Button } from '@/components/ui/button';

/** 공지 작성 버튼 컴포넌트 */
const CreateAnnouncementButton = () => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setFormDialogOpen(true)}>
				<Plus />
				공지 작성
			</Button>

			{formDialogOpen && <AnnouncementFormDialog onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default CreateAnnouncementButton;

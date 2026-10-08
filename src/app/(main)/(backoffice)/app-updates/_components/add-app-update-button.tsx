'use client';

import { useState } from 'react';

import type { Platform } from '@/types/apis/app-updates';

import { Plus } from 'lucide-react';

import AppUpdateFormDialog from '@/app/(main)/(backoffice)/app-updates/_components/app-update-form-dialog';

import { Button } from '@/components/ui/button';

interface Props {
	platform: Platform;
}

/**
 * 업데이트 추가 버튼 컴포넌트
 * @param platform 다이얼로그에서 처음 고를 플랫폼
 */
const AddAppUpdateButton = ({ platform }: Props) => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setFormDialogOpen(true)}>
				<Plus />
				업데이트 추가
			</Button>

			{formDialogOpen && <AppUpdateFormDialog platform={platform} onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default AddAppUpdateButton;

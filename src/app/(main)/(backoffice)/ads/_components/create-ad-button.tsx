'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import AdFormDialog from '@/app/(main)/(backoffice)/ads/_components/ad-form-dialog';

import { Button } from '@/components/ui/button';

/** 광고 작성 버튼 컴포넌트 */
const CreateAdButton = () => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setFormDialogOpen(true)}>
				<Plus />
				광고 작성
			</Button>

			{formDialogOpen && <AdFormDialog onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default CreateAdButton;

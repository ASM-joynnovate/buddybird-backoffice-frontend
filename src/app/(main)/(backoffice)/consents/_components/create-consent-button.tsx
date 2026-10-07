'use client';

import { useState } from 'react';

import ConsentFormDialog from '@/app/(main)/(backoffice)/consents/_components/consent-form-dialog';

import { Button } from '@/components/ui/button';

/** 고지문 생성 버튼 컴포넌트 */
const CreateConsentButton = () => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setFormDialogOpen(true)}>고지문 생성</Button>

			{formDialogOpen && <ConsentFormDialog onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default CreateConsentButton;

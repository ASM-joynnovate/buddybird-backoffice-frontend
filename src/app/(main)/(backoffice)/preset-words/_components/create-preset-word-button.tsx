'use client';

import { useState } from 'react';

import PresetWordFormDialog from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-form-dialog';

import { Button } from '@/components/ui/button';

/** 단어 프리셋 생성 버튼 컴포넌트 */
const CreatePresetWordButton = () => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setFormDialogOpen(true)}>단어 프리셋 생성</Button>

			{formDialogOpen && <PresetWordFormDialog onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default CreatePresetWordButton;

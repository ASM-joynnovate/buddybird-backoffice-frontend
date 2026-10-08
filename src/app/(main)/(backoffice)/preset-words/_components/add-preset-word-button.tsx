'use client';

import { useState } from 'react';

import type { PresetLanguage } from '@/types/apis/preset-words';

import { Plus } from 'lucide-react';

import PresetWordFormDialog from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-form-dialog';

interface Props {
	language: PresetLanguage;
}

/**
 * 단어 프리셋 추가 버튼 컴포넌트
 * @param language 추가할 프리셋의 언어
 */
const AddPresetWordButton = ({ language }: Props) => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				className="flex min-h-14 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-chart-neutral font-semibold text-muted-foreground transition-colors hover:border-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				onClick={() => setFormDialogOpen(true)}
			>
				<Plus className="size-4" />
				추가
			</button>

			{formDialogOpen && <PresetWordFormDialog language={language} onClose={() => setFormDialogOpen(false)} />}
		</>
	);
};

export default AddPresetWordButton;

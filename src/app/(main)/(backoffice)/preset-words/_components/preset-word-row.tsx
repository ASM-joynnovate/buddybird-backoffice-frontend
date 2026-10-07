'use client';

import { useState } from 'react';

import type { PresetWord } from '@/types/apis/preset-words';

import DeletePresetWordDialog from '@/app/(main)/(backoffice)/preset-words/_components/delete-preset-word-dialog';
import PresetWordFormDialog from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-form-dialog';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
	presetWord: PresetWord;
}

/**
 * 단어 프리셋 목록의 행 컴포넌트
 * @param presetWord 표시할 단어 프리셋
 */
const PresetWordRow = ({ presetWord }: Props) => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handlePlayAudio = () => {
		void new Audio(presetWord.audio_file.url).play();
	};

	return (
		<TableRow>
			<TableCell>{presetWord.language}</TableCell>
			<TableCell>{presetWord.name}</TableCell>
			<TableCell>{presetWord.audio_file.status}</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={handlePlayAudio}>
						재생
					</Button>
					<Button variant="outline" size="sm" onClick={() => setFormDialogOpen(true)}>
						수정
					</Button>
					<Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
						삭제
					</Button>
				</div>

				{formDialogOpen && (
					<PresetWordFormDialog presetWord={presetWord} onClose={() => setFormDialogOpen(false)} />
				)}

				<DeletePresetWordDialog
					open={deleteDialogOpen}
					presetWord={presetWord}
					onClose={() => setDeleteDialogOpen(false)}
				/>
			</TableCell>
		</TableRow>
	);
};

export default PresetWordRow;

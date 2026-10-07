'use client';

import { type SubmitEvent, useState } from 'react';

import { type PresetLanguage, type PresetWord, presetLanguageSchema } from '@/types/apis/preset-words';

import { useCreatePresetWord, useUpdatePresetWord } from '@/hooks/apis/preset-words';

import { PRESET_WORD_AUDIO_CONTENT_TYPES, PRESET_WORD_NAME_MAX_LENGTH } from '@/config';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
	presetWord?: PresetWord;
	onClose: () => void;
}

/**
 * 단어 프리셋 생성 및 수정 다이얼로그 컴포넌트
 * @param presetWord 수정할 단어 프리셋
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const PresetWordFormDialog = ({ presetWord, onClose }: Props) => {
	const [language, setLanguage] = useState<PresetLanguage | null>(null);
	const [name, setName] = useState(presetWord?.name ?? '');
	const [audioFile, setAudioFile] = useState<File>();

	const createPresetWord = useCreatePresetWord();
	const updatePresetWord = useUpdatePresetWord();

	const saving = createPresetWord.isPending || updatePresetWord.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		if (presetWord) {
			const nameChanged = name !== presetWord.name;

			if (!nameChanged && !audioFile) {
				onClose();

				return;
			}

			updatePresetWord.mutate(
				{ id: presetWord.id, data: { name: nameChanged ? name : undefined, file: audioFile } },
				{ onSuccess: onClose },
			);

			return;
		}

		// 빈 값은 required 속성이 제출 전에 막으므로 타입만 좁힌다
		if (!language || !audioFile) {
			return;
		}

		createPresetWord.mutate({ data: { language, name, file: audioFile } }, { onSuccess: onClose });
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSave} className="space-y-4">
					<DialogHeader>
						<DialogTitle>{presetWord ? '단어 프리셋 수정' : '단어 프리셋 생성'}</DialogTitle>
					</DialogHeader>

					{presetWord ? (
						<p className="text-sm text-muted-foreground">언어: {presetWord.language}</p>
					) : (
						<div className="space-y-2">
							<Label htmlFor="preset-word-language">언어</Label>
							<Select
								id="preset-word-language"
								name="language"
								required
								value={language}
								onValueChange={setLanguage}
							>
								<SelectTrigger>
									<SelectValue placeholder="언어 선택" />
								</SelectTrigger>
								<SelectContent>
									{presetLanguageSchema.options.map((presetLanguage) => (
										<SelectItem key={presetLanguage} value={presetLanguage}>
											{presetLanguage}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="preset-word-name">이름</Label>
						<Input
							id="preset-word-name"
							required
							maxLength={PRESET_WORD_NAME_MAX_LENGTH}
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="preset-word-audio-file">오디오 파일</Label>
						<Input
							id="preset-word-audio-file"
							type="file"
							required={!presetWord}
							accept={PRESET_WORD_AUDIO_CONTENT_TYPES.join(',')}
							onChange={(event) => setAudioFile(event.target.files?.[0])}
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" disabled={saving}>
							저장
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default PresetWordFormDialog;

'use client';

import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import type { PresetLanguage, PresetWord } from '@/types/apis/preset-words';

import { useCreatePresetWord, useGetPresetWordList, useUpdatePresetWord } from '@/hooks/apis/preset-words';

import PresetWordAudioField, {
	type PickedAudio,
} from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-audio-field';
import { PRESET_WORD_NAME_MAX_LENGTH } from '@/config';
import { toPresetLanguageName } from '@/utils/locale';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NAME_ERROR_ID = 'preset-word-name-error';

interface Props {
	language: PresetLanguage;
	presetWord?: PresetWord;
	onClose: () => void;
}

/**
 * 단어 프리셋 추가 및 수정 다이얼로그 컴포넌트
 * @param language 프리셋의 언어
 * @param presetWord 수정할 단어 프리셋
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const PresetWordFormDialog = ({ language, presetWord, onClose }: Props) => {
	const [name, setName] = useState(presetWord?.name ?? '');
	const [nameError, setNameError] = useState('');
	const [pickedAudio, setPickedAudio] = useState<PickedAudio>();
	const [audioError, setAudioError] = useState('');

	const { data: presetWordListData } = useGetPresetWordList();

	const createPresetWord = useCreatePresetWord();
	const updatePresetWord = useUpdatePresetWord();

	const languageName = toPresetLanguageName(language);
	const saving = createPresetWord.isPending || updatePresetWord.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
		setNameError('');
	};

	const handleAudioPick = (nextPickedAudio: PickedAudio) => {
		if (pickedAudio) {
			URL.revokeObjectURL(pickedAudio.url);
		}

		setPickedAudio(nextPickedAudio);
		setAudioError('');
	};

	const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const trimmedName = name.trim();
		const nameTaken = presetWordListData.some(
			(otherPresetWord) =>
				otherPresetWord.language === language &&
				otherPresetWord.id !== presetWord?.id &&
				otherPresetWord.name === trimmedName,
		);

		let nextNameError = '';

		if (!trimmedName) {
			nextNameError = '이름을 입력하세요.';
		} else if (nameTaken) {
			nextNameError = `${languageName}에 같은 이름의 프리셋이 있습니다.`;
		}

		const nextAudioError = !presetWord && !pickedAudio ? '음성 파일을 선택하세요.' : '';

		setNameError(nextNameError);
		setAudioError(nextAudioError);

		if (nextNameError || nextAudioError) {
			return;
		}

		if (presetWord) {
			const nameChanged = trimmedName !== presetWord.name;

			if (!nameChanged && !pickedAudio) {
				onClose();

				return;
			}

			updatePresetWord.mutate(
				{ id: presetWord.id, data: { name: nameChanged ? trimmedName : undefined, file: pickedAudio?.file } },
				{ onSuccess: onClose },
			);

			return;
		}

		// 음성 없는 추가는 위에서 막으므로 타입만 좁힌다
		if (!pickedAudio) {
			return;
		}

		createPresetWord.mutate(
			{ data: { language, name: trimmedName, file: pickedAudio.file } },
			{ onSuccess: onClose },
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="p-5 sm:max-w-110">
				<form onSubmit={handleSave} className="grid gap-4">
					<DialogHeader>
						<DialogTitle className="font-bold">
							{languageName} 프리셋 {presetWord ? '수정' : '추가'}
						</DialogTitle>
					</DialogHeader>

					<div>
						<Label
							htmlFor="preset-word-name"
							className="mb-1.5 items-baseline justify-between text-[13px] leading-normal font-semibold"
						>
							이름
							<span className="text-[12.5px] font-normal text-muted-foreground tabular-nums">
								{name.length}/{PRESET_WORD_NAME_MAX_LENGTH}
							</span>
						</Label>
						<Input
							id="preset-word-name"
							autoComplete="off"
							maxLength={PRESET_WORD_NAME_MAX_LENGTH}
							value={name}
							aria-invalid={!!nameError}
							aria-describedby={nameError ? NAME_ERROR_ID : undefined}
							onChange={handleNameChange}
						/>
						{!!nameError && (
							<p id={NAME_ERROR_ID} role="alert" className="mt-1.5 text-[13px] text-destructive">
								{nameError}
							</p>
						)}
					</div>

					<PresetWordAudioField
						pickedAudio={pickedAudio}
						registeredAudioUrl={presetWord?.audio_file.url}
						error={audioError}
						onAudioPick={handleAudioPick}
						onErrorChange={setAudioError}
					/>

					<p className="text-[12.5px] text-muted-foreground">저장한 뒤에 가입하는 사용자부터 적용됩니다.</p>

					<DialogFooter className="m-0 mt-1 flex-row justify-end border-0 bg-transparent p-0 *:flex-1 md:*:flex-none">
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? '저장 중' : '저장'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default PresetWordFormDialog;

'use client';

import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Upload } from 'lucide-react';

import PresetWordAudioPlayer from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-audio-player';
import { PRESET_WORD_AUDIO_CONTENT_TYPES, PRESET_WORD_AUDIO_MAX_BYTES } from '@/config';
import { formatFileSize } from '@/utils/file';

import { Button } from '@/components/ui/button';

const AUDIO_ERROR_ID = 'preset-word-audio-error';

export interface PickedAudio {
	file: File;
	url: string;
}

interface Props {
	pickedAudio?: PickedAudio;
	registeredAudioUrl?: string;
	error: string;
	onAudioPick: (pickedAudio: PickedAudio) => void;
	onErrorChange: (error: string) => void;
}

/**
 * 프리셋 음성 파일 입력 컴포넌트
 * @param pickedAudio 고른 음성 파일 및 재생 주소
 * @param registeredAudioUrl 등록된 음성의 주소
 * @param error 입력 아래에 표시할 오류 문구
 * @param onAudioPick 음성 파일을 고르면 실행할 함수
 * @param onErrorChange 오류 문구가 바뀔 때 실행할 함수
 */
const PresetWordAudioField = ({ pickedAudio, registeredAudioUrl, error, onAudioPick, onErrorChange }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [dragging, setDragging] = useState(false);

	const audioUrl = pickedAudio?.url ?? registeredAudioUrl;

	/** 오류가 없는 파일만 선택 */
	const pickAudioFile = (file: File) => {
		if (!PRESET_WORD_AUDIO_CONTENT_TYPES.includes(file.type)) {
			onErrorChange('m4a, wav, mp3 파일만 등록할 수 있습니다.');

			return;
		}

		if (file.size > PRESET_WORD_AUDIO_MAX_BYTES) {
			onErrorChange('5MB 이하의 파일만 등록할 수 있습니다.');

			return;
		}

		const url = URL.createObjectURL(file);
		const audio = new Audio(url);

		audio.addEventListener('loadedmetadata', () => onAudioPick({ file, url }));
		audio.addEventListener('error', () => {
			URL.revokeObjectURL(url);

			onErrorChange('음성을 읽을 수 없는 파일입니다.');
		});
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0];

		if (file) {
			pickAudioFile(file);
		}

		// 같은 파일도 다시 선택 가능
		event.currentTarget.value = '';
	};

	const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
		event.preventDefault();

		setDragging(true);
	};

	const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
		const file = event.dataTransfer.files[0];

		event.preventDefault();

		setDragging(false);

		if (file) {
			pickAudioFile(file);
		}
	};

	return (
		<div>
			<p className="mb-1.5 text-[13px] font-semibold">음성</p>

			<input
				ref={fileInputRef}
				type="file"
				hidden
				accept={PRESET_WORD_AUDIO_CONTENT_TYPES.join(',')}
				onChange={handleFileChange}
			/>

			{audioUrl ? (
				<>
					<PresetWordAudioPlayer
						key={audioUrl}
						audioUrl={audioUrl}
						name={pickedAudio?.file.name ?? '등록된 음성'}
					/>

					<div className="mt-2 flex items-center justify-between gap-3">
						<p className="flex min-w-0 items-baseline gap-2 text-[13px]">
							{pickedAudio ? (
								<>
									<strong className="truncate font-semibold">{pickedAudio.file.name}</strong>
									<span className="whitespace-nowrap text-muted-foreground tabular-nums">
										{formatFileSize(pickedAudio.file.size)}
									</span>
								</>
							) : (
								<span className="text-muted-foreground">등록된 음성</span>
							)}
						</p>

						<Button
							type="button"
							variant="outline"
							size="sm"
							aria-describedby={error ? AUDIO_ERROR_ID : undefined}
							onClick={() => fileInputRef.current?.click()}
						>
							파일 변경
						</Button>
					</div>
				</>
			) : (
				<button
					type="button"
					aria-describedby={error ? AUDIO_ERROR_ID : undefined}
					className={cn(
						'grid w-full justify-items-center gap-0.5 rounded-lg border border-dashed border-chart-neutral bg-card-inset px-4 py-5 text-center transition-colors *:pointer-events-none hover:border-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
						dragging && 'border-muted-foreground bg-muted',
					)}
					onClick={() => fileInputRef.current?.click()}
					onDragOver={handleDragOver}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
				>
					<Upload className="mb-1 size-4.5 text-muted-foreground" />
					<strong className="font-semibold">음성 파일을 끌어다 놓거나 선택하세요</strong>
					<span className="text-[12.5px] text-muted-foreground">m4a, wav, mp3 파일, 5MB 이하</span>
				</button>
			)}

			{!!error && (
				<p id={AUDIO_ERROR_ID} role="alert" className="mt-1.5 text-[13px] text-destructive">
					{error}
				</p>
			)}
		</div>
	);
};

export default PresetWordAudioField;

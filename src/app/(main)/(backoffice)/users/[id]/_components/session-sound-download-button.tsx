'use client';

import type { SessionSound } from '@/types/apis/sessions';

import { useDownloadSessionSoundFiles } from '@/hooks/apis/sessions';

import { Download } from 'lucide-react';

import { joinWavFiles } from '@/utils/audio';
import { saveFile } from '@/utils/file';

import { Button } from '@/components/ui/button';

interface Props {
	sounds: SessionSound[];
	fileName: string;
	label: string;
	iconOnly?: boolean;
}

/**
 * 소리를 WAV 파일 하나로 저장하는 버튼 컴포넌트
 * @param sounds 순서대로 이어 붙일 소리 목록
 * @param fileName 저장할 파일 이름
 * @param label 버튼의 aria-label
 * @param iconOnly 글자 없이 아이콘만 표시할지 여부
 */
const SessionSoundDownloadButton = ({ sounds, fileName, label, iconOnly = false }: Props) => {
	const downloadSessionSoundFiles = useDownloadSessionSoundFiles();

	const handleDownload = () => {
		if (downloadSessionSoundFiles.isPending) {
			return;
		}

		downloadSessionSoundFiles.mutate(
			{ urls: sounds.map((sound) => sound.audio_file.url) },
			{ onSuccess: (wavFiles) => saveFile(joinWavFiles(wavFiles), fileName) },
		);
	};

	if (iconOnly) {
		return (
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label={label}
				title="다운로드"
				loading={downloadSessionSoundFiles.isPending}
				className="text-muted-foreground hover:bg-card"
				onClick={handleDownload}
			>
				<Download />
			</Button>
		);
	}

	return (
		<Button
			variant="outline"
			size="sm"
			aria-label={label}
			loading={downloadSessionSoundFiles.isPending}
			onClick={handleDownload}
		>
			<Download data-icon="inline-start" />
			다운로드
		</Button>
	);
};

export default SessionSoundDownloadButton;

'use client';

import { useState } from 'react';

import type { PresetWord } from '@/types/apis/preset-words';

import useAudioPlayer from '@/hooks/use-audio-player';

import { cn } from '@/lib/utils';

import { Pencil, Play, Square, Trash2 } from 'lucide-react';

import DeletePresetWordDialog from '@/app/(main)/(backoffice)/preset-words/_components/delete-preset-word-dialog';
import PresetWordFormDialog from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-form-dialog';
import { formatAudioDuration } from '@/utils/audio';

import { Button } from '@/components/ui/button';

interface Props {
	presetWord: PresetWord;
}

/**
 * 단어 프리셋 한 칸 컴포넌트
 * @param presetWord 표시할 단어 프리셋
 */
const PresetWordItem = ({ presetWord }: Props) => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { playing, progressPercent, durationSeconds, handleTogglePlay, audioProps } = useAudioPlayer();

	return (
		<li className="flex min-h-14 min-w-0 items-center gap-2.5 rounded-lg bg-muted py-2.5 pr-2 pl-2.5">
			<audio src={presetWord.audio_file.url} preload="metadata" {...audioProps}>
				<track kind="captions" />
			</audio>

			<button
				type="button"
				aria-label={`${presetWord.name} ${playing ? '정지' : '재생'}`}
				className={cn(
					'relative grid size-9 shrink-0 place-items-center rounded-full bg-card text-foreground transition-colors hover:bg-chart-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
					playing && 'bg-foreground text-card hover:bg-foreground',
				)}
				onClick={handleTogglePlay}
			>
				{/*둘레 3px에 진행한 만큼 표시*/}
				<svg
					aria-hidden
					viewBox="0 0 36 36"
					className="absolute inset-0 size-full -rotate-90 fill-none stroke-3"
				>
					<circle cx="18" cy="18" r="16.5" className="stroke-card" />
					<circle
						cx="18"
						cy="18"
						r="16.5"
						pathLength="100"
						strokeDasharray={`${playing ? progressPercent : 0} 100`}
						className="stroke-chart-1"
					/>
				</svg>

				{playing ? (
					<Square className="relative size-3 fill-current" />
				) : (
					<Play className="relative size-3.5 fill-current" />
				)}
			</button>

			<div className="mr-auto min-w-0">
				<strong title={presetWord.name} className="block truncate font-semibold">
					{presetWord.name}
				</strong>
				{/*음성 길이를 읽기 전에도 줄 높이 유지*/}
				<time className="block min-h-lh text-[13px] text-muted-foreground tabular-nums">
					{durationSeconds !== null && formatAudioDuration(durationSeconds)}
				</time>
			</div>

			<div className="flex gap-0.5">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`${presetWord.name} 수정`}
					title="수정"
					className="text-muted-foreground hover:bg-card"
					onClick={() => setFormDialogOpen(true)}
				>
					<Pencil />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`${presetWord.name} 삭제`}
					title="삭제"
					className="text-muted-foreground hover:bg-card hover:text-destructive"
					onClick={() => setDeleteDialogOpen(true)}
				>
					<Trash2 />
				</Button>
			</div>

			{formDialogOpen && (
				<PresetWordFormDialog
					language={presetWord.language}
					presetWord={presetWord}
					onClose={() => setFormDialogOpen(false)}
				/>
			)}

			<DeletePresetWordDialog
				open={deleteDialogOpen}
				presetWord={presetWord}
				onClose={() => setDeleteDialogOpen(false)}
			/>
		</li>
	);
};

export default PresetWordItem;

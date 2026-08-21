import { AudioSegment } from '@/types/audio-segment';

export const LabelStatusEnum = {
	UNLABELED: 'UL',
	LABELED: 'LA',
	ALL: 'AL',
} as const;
export type LabelStatusEnum = (typeof LabelStatusEnum)[keyof typeof LabelStatusEnum];

export const LabelStatusLabel: Record<LabelStatusEnum, string> = {
	[LabelStatusEnum.ALL]: '전체',
	[LabelStatusEnum.UNLABELED]: '미라벨',
	[LabelStatusEnum.LABELED]: '라벨완료',
};

export const PhaseEnum = {
	LEARN: 'LE',
	RECORD: 'RE',
} as const;
export type PhaseEnum = (typeof PhaseEnum)[keyof typeof PhaseEnum];

export interface AudioCaptureListItem {
	id: string;
	firebaseAnonUid: string;
	clientWordId: string;
	wordId: string | null;
	cycle: number;
	phase: PhaseEnum;
	capturedAt: string;
	durationMs: number | null;
	createdAt: string;
	segmentCount: number;
	labeledCount: number;
}

export interface AudioCaptureDetail {
	id: string;
	firebaseAnonUid: string;
	clientWordId: string;
	wordId: string | null;
	cycle: number;
	phase: PhaseEnum;
	capturedAt: string;
	durationMs: number | null;
	createdAt: string;
	parrotSpecies: string | null;
	parrotBirthdate: string | null;
	audioUrl: string;
	segments: AudioSegment[];
}

import { AudioSegment } from '@/types/audio-segment';

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
	labelOptionIds: string[];
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
	memo: string | null;
	audioUrl: string;
	segments: AudioSegment[];
	labelOptionIds: string[];
}

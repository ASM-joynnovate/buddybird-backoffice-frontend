import { AudioSegment } from '@/types/audio-segment';

export const PhaseEnum = {
	LEARN: 'LE',
	RECORD: 'RE',
} as const;
export type PhaseEnum = (typeof PhaseEnum)[keyof typeof PhaseEnum];

export const PHASE_LABEL: Record<PhaseEnum, string> = {
	[PhaseEnum.LEARN]: '학습',
	[PhaseEnum.RECORD]: '녹음',
};

export interface AudioCaptureListItem {
	id: string;
	firebaseAnonUid: string;
	word: { id: string; label: string } | null;
	cycle: number;
	phase: PhaseEnum;
	capturedAt: string;
	durationMs: number | null;
	createdAt: string;
	parrotSpecies: string | null;
	devicePlatform: string | null;
	deviceOsVersion: string | null;
	deviceModel: string | null;
	segmentCount: number;
	labeledCount: number;
	labelOptionIds: string[];
}

export interface AudioCaptureDetail {
	id: string;
	firebaseAnonUid: string;
	word: {
		id: string;
		label: string;
		firebaseAnonUid: string | null;
		clientWordId: string;
		devicePlatform: string | null;
		deviceOsVersion: string | null;
		deviceModel: string | null;
	} | null;
	cycle: number;
	phase: PhaseEnum;
	capturedAt: string;
	durationMs: number | null;
	createdAt: string;
	parrotSpecies: string | null;
	parrotBirthdate: string | null;
	devicePlatform: string | null;
	deviceOsVersion: string | null;
	deviceModel: string | null;
	memo: string | null;
	audioUrl: string;
	segments: AudioSegment[];
	labelOptionIds: string[];
}

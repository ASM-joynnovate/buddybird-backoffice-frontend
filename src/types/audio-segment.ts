export interface AudioSegment {
	id: string;
	startMs: number;
	endMs: number;
	labelOptionId: string | null;
	audioUrl: string;
	memo: string | null;
}

export interface CreateAudioSegmentRequest {
	startMs: number;
	endMs: number;
}

export interface TrimAudioSegmentRequest {
	startMs: number;
	endMs: number;
}

export interface AssignAudioSegmentLabelRequest {
	labelOptionId: string;
}

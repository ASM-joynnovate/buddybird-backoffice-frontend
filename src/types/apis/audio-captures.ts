import ApiResponse from '@/types/apis';

import { AudioCaptureDetail, AudioCaptureListItem } from '@/types/audio-capture';
import { PaginationMeta, PaginationParams } from '@/types/common';

export interface GetAudioCaptureListResponse extends ApiResponse {
	data: AudioCaptureListItem[];
	meta: PaginationMeta;
}

export interface GetAudioCaptureDetailResponse extends ApiResponse {
	data: AudioCaptureDetail;
}

export type AudioCaptureListParams = PaginationParams & {
	firebaseAnonUid?: string;
	wordLabel?: string;
	labelOptionIds?: string[];
	dateFrom?: string;
	dateTo?: string;
};

export interface AssignAudioCaptureLabelsRequest {
	labelOptionIds: string[];
}

export type ExportAudioSegmentsParams = {
	firebaseAnonUid?: string;
	wordLabel?: string;
	audioCaptureLabelOptionIds?: string[];
	dateFrom?: string;
	dateTo?: string;
};

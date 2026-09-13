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
	parrotSpecies?: string;
	deviceModel?: string;
	devicePlatform?: string;
	deviceOsVersion?: string;
	labelOptionIds?: string[];
	dateFrom?: string;
	dateTo?: string;
};

export interface AssignAudioCaptureLabelsRequest {
	labelOptionIds: string[];
}

export interface UpdateAudioCaptureMemoRequest {
	memo: string | null;
}

import ApiResponse from '@/types/apis';

import { AudioCaptureDetail, AudioCaptureListItem, LabelStatusEnum } from '@/types/audio-capture';
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
	labelStatus?: LabelStatusEnum;
	dateFrom?: string;
	dateTo?: string;
};

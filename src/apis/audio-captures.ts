import { buildQueryString } from '@/apis/common';

import {
	AudioCaptureListParams,
	GetAudioCaptureDetailResponse,
	GetAudioCaptureListResponse,
} from '@/types/apis/audio-captures';

import { getAuthHeader } from '@/lib/auth';
import fetcher from '@/lib/fetcher';

export const getAudioCaptureList = async (
	params?: AudioCaptureListParams,
	password?: string,
): Promise<GetAudioCaptureListResponse> => {
	return await fetcher(`/api/v1/backoffice/captures${buildQueryString(params)}`, {
		method: 'GET',
		headers: getAuthHeader(password),
	});
};

export const getAudioCaptureDetail = async (
	audioCaptureId: string,
	password?: string,
): Promise<GetAudioCaptureDetailResponse> => {
	return await fetcher(`/api/v1/backoffice/captures/${audioCaptureId}`, {
		method: 'GET',
		headers: getAuthHeader(password),
	});
};

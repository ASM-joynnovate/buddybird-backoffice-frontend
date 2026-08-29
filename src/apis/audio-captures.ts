import { buildQueryString } from '@/apis/common';

import ApiResponse from '@/types/apis';
import {
	AssignAudioCaptureLabelsRequest,
	AudioCaptureListParams,
	GetAudioCaptureDetailResponse,
	GetAudioCaptureListResponse,
} from '@/types/apis/audio-captures';

import { getAuthHeader } from '@/lib/auth';
import fetcher from '@/lib/fetcher';
import { snakelize } from '@/lib/utils';

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

export const assignAudioCaptureLabels = async (
	audioCaptureId: string,
	data: AssignAudioCaptureLabelsRequest,
	password?: string,
): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/captures/${audioCaptureId}/labels`, {
		method: 'PUT',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

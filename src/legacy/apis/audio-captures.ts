import { buildQueryString } from '@/legacy/apis/common';

import ApiResponse from '@/legacy/types/apis';
import {
	AssignAudioCaptureLabelsRequest,
	AudioCaptureListParams,
	GetAudioCaptureDetailResponse,
	GetAudioCaptureListResponse,
	UpdateAudioCaptureMemoRequest,
} from '@/legacy/types/apis/audio-captures';

import { getAuthHeader } from '@/legacy/lib/auth';
import fetcher from '@/legacy/lib/fetcher';
import { snakelize } from '@/legacy/lib/utils';

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

export const updateAudioCaptureMemo = async (
	audioCaptureId: string,
	data: UpdateAudioCaptureMemoRequest,
	password?: string,
): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/captures/${audioCaptureId}/memo`, {
		method: 'PUT',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

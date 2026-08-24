import ApiResponse from '@/types/apis';
import {
	AssignAudioSegmentLabelRequest,
	CreateAudioSegmentRequest,
	TrimAudioSegmentRequest,
	UpdateAudioSegmentMemoRequest,
} from '@/types/apis/audio-segments';

import { getAuthHeader } from '@/lib/auth';
import fetcher from '@/lib/fetcher';
import { snakelize } from '@/lib/utils';

export const createAudioSegment = async (
	audioCaptureId: string,
	data: CreateAudioSegmentRequest,
	password?: string,
): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/captures/${audioCaptureId}/segments`, {
		method: 'POST',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const runAudioCaptureVad = async (audioCaptureId: string, password?: string): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/captures/${audioCaptureId}/vad`, {
		method: 'POST',
		headers: getAuthHeader(password),
	});
};

export const trimAudioSegment = async (
	audioSegmentId: string,
	data: TrimAudioSegmentRequest,
	password?: string,
): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/segments/${audioSegmentId}/trim`, {
		method: 'PUT',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const assignAudioSegmentLabel = async (
	audioSegmentId: string,
	data: AssignAudioSegmentLabelRequest,
	password?: string,
): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/segments/${audioSegmentId}/label`, {
		method: 'PUT',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const updateAudioSegmentMemo = async (
	audioSegmentId: string,
	data: UpdateAudioSegmentMemoRequest,
	password?: string,
): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/segments/${audioSegmentId}/memo`, {
		method: 'PUT',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const deleteAudioSegment = async (audioSegmentId: string, password?: string): Promise<ApiResponse> => {
	return await fetcher(`/api/v1/backoffice/segments/${audioSegmentId}`, {
		method: 'DELETE',
		headers: getAuthHeader(password),
	});
};

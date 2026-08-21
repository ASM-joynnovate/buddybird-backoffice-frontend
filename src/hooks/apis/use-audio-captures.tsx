import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getAudioCaptureDetail, getAudioCaptureList } from '@/apis/audio-captures';

import { AudioCaptureListParams } from '@/types/apis/audio-captures';

export const getAudioCaptureListOptions = (params?: AudioCaptureListParams, password?: string) =>
	queryOptions({
		queryKey: ['audio-captures', params, password],
		queryFn: () => getAudioCaptureList(params, password).then((res) => ({ data: res.data, meta: res.meta })),
	});

export const useGetAudioCaptureList = (params?: AudioCaptureListParams) => {
	return useSuspenseQuery(getAudioCaptureListOptions(params));
};

export const getAudioCaptureDetailOptions = (audioCaptureId: string, password?: string) =>
	queryOptions({
		queryKey: ['audio-captures', audioCaptureId, password],
		queryFn: () => getAudioCaptureDetail(audioCaptureId, password).then((res) => res.data),
	});

export const useGetAudioCaptureDetail = (audioCaptureId: string) => {
	return useSuspenseQuery(getAudioCaptureDetailOptions(audioCaptureId));
};

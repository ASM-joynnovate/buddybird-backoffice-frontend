import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { assignAudioCaptureLabels, getAudioCaptureDetail, getAudioCaptureList } from '@/apis/audio-captures';

import { AssignAudioCaptureLabelsRequest, AudioCaptureListParams } from '@/types/apis/audio-captures';

import { getQueryClient } from '@/lib/react-query';

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

export const useAssignAudioCaptureLabels = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: (data: AssignAudioCaptureLabelsRequest) => assignAudioCaptureLabels(audioCaptureId, data),
		onSuccess: (_, variables) => {
			queryClient.setQueryData(getAudioCaptureDetailOptions(audioCaptureId).queryKey, (old) =>
				old ? { ...old, labelOptionIds: variables.labelOptionIds } : old,
			);
			queryClient.invalidateQueries({
				queryKey: ['audio-captures'],
				predicate: (query) => typeof query.queryKey[1] !== 'string',
			});
		},
	});
};

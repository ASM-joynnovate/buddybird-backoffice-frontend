import { useMutation } from '@tanstack/react-query';

import {
	assignAudioSegmentLabel,
	createAudioSegment,
	deleteAudioSegment,
	runAudioCaptureVad,
	trimAudioSegment,
	updateAudioSegmentMemo,
} from '@/apis/audio-segments';

import {
	AssignAudioSegmentLabelRequest,
	CreateAudioSegmentRequest,
	TrimAudioSegmentRequest,
	UpdateAudioSegmentMemoRequest,
} from '@/types/apis/audio-segments';

import { getQueryClient } from '@/lib/react-query';

export const useRunAudioCaptureVad = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: () => runAudioCaptureVad(audioCaptureId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audio-captures', audioCaptureId] }),
	});
};

export const useCreateAudioSegment = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: (data: CreateAudioSegmentRequest) => createAudioSegment(audioCaptureId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audio-captures', audioCaptureId] }),
	});
};

export const useTrimAudioSegment = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: ({ audioSegmentId, data }: { audioSegmentId: string; data: TrimAudioSegmentRequest }) =>
			trimAudioSegment(audioSegmentId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audio-captures', audioCaptureId] }),
	});
};

export const useAssignAudioSegmentLabel = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: ({ audioSegmentId, data }: { audioSegmentId: string; data: AssignAudioSegmentLabelRequest }) =>
			assignAudioSegmentLabel(audioSegmentId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audio-captures', audioCaptureId] }),
	});
};

export const useUpdateAudioSegmentMemo = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: ({ audioSegmentId, data }: { audioSegmentId: string; data: UpdateAudioSegmentMemoRequest }) =>
			updateAudioSegmentMemo(audioSegmentId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audio-captures', audioCaptureId] }),
	});
};

export const useDeleteAudioSegment = (audioCaptureId: string) => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: (audioSegmentId: string) => deleteAudioSegment(audioSegmentId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audio-captures', audioCaptureId] }),
	});
};

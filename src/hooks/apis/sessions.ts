import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	getSessionEvent,
	getSessionEventList,
	getSessionSound,
	getSessionSoundFiles,
	getSessionSoundList,
	postSessionEventLabelCancel,
	postSessionSoundLabelCancel,
	postSessionSoundMimicJudgment,
	putSessionEventLabel,
	putSessionSoundLabel,
} from '@/apis/sessions';

import type { SessionEventListParams, SessionSoundListParams } from '@/types/apis/sessions';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

import { SESSION_SOUND_REFETCH_INTERVAL_MS } from '@/config';

/** 세션 이벤트 목록 조회 Hook에 사용할 옵션 */
export const getSessionEventListOptions = ({ id, ...listParams }: { id: string } & SessionEventListParams) =>
	queryOptions({
		queryKey: apiKeys.sessions.eventList(id, listParams),
		queryFn: () => getSessionEventList({ id, ...listParams }),
	});

/** 세션 이벤트 상세 조회 Hook에 사용할 옵션 */
export const getSessionEventOptions = ({ id, eventId }: { id: string; eventId: string }) =>
	queryOptions({ queryKey: apiKeys.sessions.event(id, eventId), queryFn: () => getSessionEvent({ id, eventId }) });
/** 세션 이벤트 상세 조회 Hook */
export const useGetSessionEvent = ({ id, eventId }: { id: string; eventId: string }) => {
	return useSuspenseQuery(getSessionEventOptions({ id, eventId }));
};

/** 세션 소리 목록 조회 Hook에 사용할 옵션 */
export const getSessionSoundListOptions = ({ id, ...listParams }: { id: string } & SessionSoundListParams) =>
	queryOptions({
		queryKey: apiKeys.sessions.soundList(id, listParams),
		queryFn: () => getSessionSoundList({ id, ...listParams }),
		// 파일 주소가 만료되기 전에 다시 조회
		refetchInterval: SESSION_SOUND_REFETCH_INTERVAL_MS,
		refetchIntervalInBackground: true,
	});

/** 세션 소리 상세 조회 Hook에 사용할 옵션 */
export const getSessionSoundOptions = ({ id, soundId }: { id: string; soundId: string }) =>
	queryOptions({ queryKey: apiKeys.sessions.sound(id, soundId), queryFn: () => getSessionSound({ id, soundId }) });
/** 세션 소리 상세 조회 Hook */
export const useGetSessionSound = ({ id, soundId }: { id: string; soundId: string }) => {
	return useSuspenseQuery(getSessionSoundOptions({ id, soundId }));
};

/** 세션 이벤트 라벨 저장 Hook */
export const useUpdateSessionEventLabel = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('sessions', 'events', 'label', 'update'),
		mutationFn: putSessionEventLabel,
		onSuccess: async (_data, { id }) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.sessions.detail(id) }),
				queryClient.invalidateQueries({ queryKey: apiKeys.users.all() }),
				queryClient.invalidateQueries({ queryKey: apiKeys.emergencies.all() }),
			]);

			toast.success('라벨을 저장했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 세션 이벤트 라벨 취소 Hook */
export const useCancelSessionEventLabel = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('sessions', 'events', 'label', 'cancel'),
		mutationFn: postSessionEventLabelCancel,
		onSuccess: async (_data, { id }) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.sessions.detail(id) }),
				queryClient.invalidateQueries({ queryKey: apiKeys.users.all() }),
				queryClient.invalidateQueries({ queryKey: apiKeys.emergencies.all() }),
			]);

			toast.success('라벨을 취소했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 세션 소리 라벨 저장 Hook */
export const useUpdateSessionSoundLabel = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('sessions', 'sounds', 'label', 'update'),
		mutationFn: putSessionSoundLabel,
		onSuccess: async (_data, { id }) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.sessions.detail(id) }),
				queryClient.invalidateQueries({ queryKey: apiKeys.users.all() }),
			]);

			toast.success('라벨을 저장했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 세션 소리 라벨 취소 Hook */
export const useCancelSessionSoundLabel = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('sessions', 'sounds', 'label', 'cancel'),
		mutationFn: postSessionSoundLabelCancel,
		onSuccess: async (_data, { id }) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.sessions.detail(id) }),
				queryClient.invalidateQueries({ queryKey: apiKeys.users.all() }),
			]);

			toast.success('라벨을 삭제했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 세션 소리 모사 판정 요청 Hook */
export const useRequestSessionSoundMimicJudgment = () => {
	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('sessions', 'sounds', 'mimic-judgments'),
		mutationFn: postSessionSoundMimicJudgment,
		onSuccess: () => toast.success('모사 판정을 요청했습니다.'),
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 세션 소리 파일 다운로드 Hook */
export const useDownloadSessionSoundFiles = () => {
	return useMutation({
		mutationKey: apiKeys.mutation('sessions', 'sound-files'),
		mutationFn: getSessionSoundFiles,
		onError: () => toast.error('소리를 다운로드하지 못했습니다.'),
	});
};

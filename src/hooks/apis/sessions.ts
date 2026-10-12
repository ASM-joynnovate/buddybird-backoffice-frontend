import { queryOptions, useMutation } from '@tanstack/react-query';

import { getSessionEventList, getSessionSoundFiles, getSessionSoundList } from '@/apis/sessions';

import { apiKeys } from '@/hooks/apis/keys';

import { toast } from 'sonner';

import { SESSION_SOUND_REFETCH_INTERVAL_MS } from '@/config';

/** 세션 이벤트 조회 Hook에 사용할 옵션 */
export const getSessionEventListOptions = ({ id }: { id: string }) =>
	queryOptions({ queryKey: apiKeys.sessions.eventList(id), queryFn: () => getSessionEventList({ id }) });

/** 세션 소리 조회 Hook에 사용할 옵션 */
export const getSessionSoundListOptions = ({ id }: { id: string }) =>
	queryOptions({
		queryKey: apiKeys.sessions.soundList(id),
		queryFn: () => getSessionSoundList({ id }),
		// 파일 주소가 만료되기 전에 다시 조회
		refetchInterval: SESSION_SOUND_REFETCH_INTERVAL_MS,
		refetchIntervalInBackground: true,
	});

/** 세션 소리 파일 다운로드 Hook */
export const useDownloadSessionSoundFiles = () => {
	return useMutation({
		mutationKey: apiKeys.mutation('sessions', 'sound-files'),
		mutationFn: getSessionSoundFiles,
		onError: () => toast.error('소리를 다운로드하지 못했습니다.'),
	});
};

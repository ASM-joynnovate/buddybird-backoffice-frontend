import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getSessionEventList, getSessionSoundList } from '@/apis/sessions';

import { apiKeys } from '@/hooks/apis/keys';

/** 세션 이벤트 조회 Hook에 사용할 옵션 */
export const getSessionEventListOptions = ({ id }: { id: string }) =>
	queryOptions({ queryKey: apiKeys.sessions.eventList(id), queryFn: () => getSessionEventList({ id }) });
/** 세션 이벤트 조회 Hook */
export const useGetSessionEventList = ({ id }: { id: string }) => {
	return useSuspenseQuery(getSessionEventListOptions({ id }));
};

/** 세션 소리 시각 조회 Hook에 사용할 옵션 */
export const getSessionSoundListOptions = ({ id }: { id: string }) =>
	queryOptions({ queryKey: apiKeys.sessions.soundList(id), queryFn: () => getSessionSoundList({ id }) });
/** 세션 소리 시각 조회 Hook */
export const useGetSessionSoundList = ({ id }: { id: string }) => {
	return useSuspenseQuery(getSessionSoundListOptions({ id }));
};

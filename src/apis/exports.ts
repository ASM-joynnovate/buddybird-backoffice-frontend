import { buildQueryString } from '@/apis/common';

import { ExportAudioSegmentsParams } from '@/types/apis/audio-captures';

import { getAuthHeader } from '@/lib/auth';
import fetcher, { type BlobResponse } from '@/lib/fetcher';

export const exportAudioSegments = async (
	params?: ExportAudioSegmentsParams,
	password?: string,
): Promise<BlobResponse> => {
	return await fetcher(`/api/v1/backoffice/exports/segments${buildQueryString(params)}`, {
		method: 'GET',
		headers: getAuthHeader(password),
		responseType: 'blob',
	});
};

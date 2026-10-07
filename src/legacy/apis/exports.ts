import { getAuthHeader } from '@/legacy/lib/auth';
import fetcher, { type BlobResponse } from '@/legacy/lib/fetcher';

export const exportAudioSegments = async (password?: string): Promise<BlobResponse> => {
	return await fetcher('/api/v1/backoffice/exports/segments', {
		method: 'GET',
		headers: getAuthHeader(password),
		responseType: 'blob',
	});
};

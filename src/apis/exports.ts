import { getAuthHeader } from '@/lib/auth';
import fetcher, { type BlobResponse } from '@/lib/fetcher';

export const exportAudioSegments = async (password?: string): Promise<BlobResponse> => {
	return await fetcher('/api/v1/backoffice/exports/segments', {
		method: 'GET',
		headers: getAuthHeader(password),
		responseType: 'blob',
	});
};

import { type Upload, uploadSchema } from '@/types/apis/uploads';

import { apiRequest } from '@/lib/api';

import { API_TIMEOUT_MS } from '@/config';

export const postAnnouncementImageUpload = async ({
	id,
	file,
	idempotencyKey,
}: {
	id: string;
	file: File;
	idempotencyKey: string;
}): Promise<Upload> => {
	const { data: upload } = await apiRequest(`/api/v1/backoffice/announcements/${id}/images`, uploadSchema, {
		method: 'POST',
		json: { content_type: file.type, file_size: file.size },
		idempotencyKey,
	});

	return upload;
};

export const postNotificationImageUpload = async ({
	file,
	idempotencyKey,
}: {
	file: File;
	idempotencyKey: string;
}): Promise<Upload> => {
	const { data: upload } = await apiRequest('/api/v1/backoffice/notifications/images', uploadSchema, {
		method: 'POST',
		json: { content_type: file.type, file_size: file.size },
		idempotencyKey,
	});

	return upload;
};

export const putUploadFile = async ({ upload, file }: { upload: Upload; file: File }): Promise<void> => {
	const response = await fetch(upload.url, {
		method: 'PUT',
		headers: upload.headers,
		body: file,
		signal: AbortSignal.timeout(API_TIMEOUT_MS),
	});

	if (!response.ok) {
		throw new Error(`Upload failed (HTTP ${response.status})`);
	}
};

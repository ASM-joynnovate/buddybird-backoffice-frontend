import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const postFeedItemHide = async ({
	id,
	idempotencyKey,
}: {
	id: string;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/feed/${id}/hide`, z.unknown(), { method: 'POST', idempotencyKey });
};

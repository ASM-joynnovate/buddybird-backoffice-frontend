import { type Page, pageMetaSchema } from '@/types/apis/common';
import { type Feedback, feedbackSchema } from '@/types/apis/feedback';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getFeedbackList = async ({ page }: { page: number }): Promise<Page<Feedback>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/feedback', z.array(feedbackSchema), {
		searchParams: { page },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

import { type Page, pageMetaSchema } from '@/types/apis/common';
import { type Feedback, type FeedbackListParams, feedbackSchema } from '@/types/apis/feedback';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getFeedbackList = async ({
	page,
	count_by_page,
	user_id,
}: FeedbackListParams): Promise<Page<Feedback>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/feedback', z.array(feedbackSchema), {
		searchParams: { page, count_by_page, user_id },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

import { type CountedPage, countedPageMetaSchema } from '@/types/apis/common';
import { type Feedback, type FeedbackListParams, feedbackSchema } from '@/types/apis/feedback';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getFeedbackList = async (listParams: FeedbackListParams): Promise<CountedPage<Feedback>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/feedback', z.array(feedbackSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

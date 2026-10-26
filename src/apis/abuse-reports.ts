import { type AbuseReport, type AbuseReportListParams, abuseReportSchema } from '@/types/apis/abuse-reports';
import { type CountedPage, countedPageMetaSchema } from '@/types/apis/common';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getAbuseReportList = async (listParams: AbuseReportListParams): Promise<CountedPage<AbuseReport>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/abuse-reports', z.array(abuseReportSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

export const postAbuseReportHandle = async ({
	id,
	idempotencyKey,
}: {
	id: string;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/abuse-reports/${id}/handle`, z.unknown(), {
		method: 'POST',
		idempotencyKey,
	});
};

import { type CountedPage, countedPageMetaSchema } from '@/types/apis/common';
import { type Emergency, type EmergencyListParams, emergencySchema } from '@/types/apis/emergencies';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getEmergencyList = async (listParams: EmergencyListParams): Promise<CountedPage<Emergency>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/emergencies', z.array(emergencySchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

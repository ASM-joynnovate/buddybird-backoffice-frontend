import { type Page, pageMetaSchema } from '@/types/apis/common';
import { type WithdrawalListItem, type WithdrawalListParams, withdrawalListItemSchema } from '@/types/apis/withdrawals';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getWithdrawalList = async (listParams: WithdrawalListParams): Promise<Page<WithdrawalListItem>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/withdrawals', z.array(withdrawalListItemSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

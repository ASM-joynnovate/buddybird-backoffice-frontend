import { fileSchema } from '@/types/apis/common';
import { deviceSchema } from '@/types/apis/devices';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { settingsSchema } from '@/types/apis/settings';
import { withdrawalSchema } from '@/types/apis/withdrawals';

import { z } from 'zod';

export const userSchema = z.object({
	id: uuidSchema,
	email: z.string().nullable(),
	nickname: z.string().nullable(),
	is_anonymous: z.boolean(),
	is_deleted: z.boolean(),
	created_at: timestampSchema,
});

export const userDetailSchema = userSchema.extend({
	photo_file: fileSchema.nullable(),
	settings: settingsSchema.nullable(),
	devices: z.array(deviceSchema),
	withdrawal: withdrawalSchema.nullable(),
});

export type User = z.infer<typeof userSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;

export interface UserListParams {
	page: number;
	keyword?: string;
	is_deleted?: boolean;
}

import { fileSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

const wordRecordingSchema = z.object({
	id: uuidSchema,
	audio_file: fileSchema,
	display_order: z.number().int(),
	created_at: timestampSchema,
	is_preset: z.boolean(),
});

export const userWordSchema = z.object({
	id: uuidSchema,
	name: z.string(),
	recordings: z.array(wordRecordingSchema),
});

export type WordRecording = z.infer<typeof wordRecordingSchema>;
export type UserWord = z.infer<typeof userWordSchema>;

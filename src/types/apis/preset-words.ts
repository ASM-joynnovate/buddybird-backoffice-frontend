import { fileSchema } from '@/types/apis/common';
import { uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const presetLanguageSchema = z.enum(['ko', 'en']);

export const presetWordSchema = z.object({
	id: uuidSchema,
	language: presetLanguageSchema,
	name: z.string(),
	audio_file: fileSchema,
});

export type PresetLanguage = z.infer<typeof presetLanguageSchema>;
export type PresetWord = z.infer<typeof presetWordSchema>;

export interface CreatePresetWordRequest {
	language: PresetLanguage;
	name: string;
	file: File;
}

export interface UpdatePresetWordRequest {
	name?: string;
	file?: File;
}

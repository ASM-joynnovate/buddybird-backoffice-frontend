import {
	type CreatePresetWordRequest,
	type PresetWord,
	presetWordSchema,
	type UpdatePresetWordRequest,
} from '@/types/apis/preset-words';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getPresetWordList = async (): Promise<PresetWord[]> => {
	const { data: presetWords } = await apiRequest('/api/v1/backoffice/preset-words', z.array(presetWordSchema));

	return presetWords;
};

export const postPresetWord = async ({ data }: { data: CreatePresetWordRequest }): Promise<PresetWord> => {
	const formData = new FormData();

	formData.append('language', data.language);
	formData.append('name', data.name);
	formData.append('file', data.file);

	const { data: presetWord } = await apiRequest('/api/v1/backoffice/preset-words', presetWordSchema, {
		method: 'POST',
		body: formData,
	});

	return presetWord;
};

export const patchPresetWord = async ({
	id,
	data,
}: {
	id: string;
	data: UpdatePresetWordRequest;
}): Promise<PresetWord> => {
	const formData = new FormData();

	if (data.name) {
		formData.append('name', data.name);
	}

	if (data.file) {
		formData.append('file', data.file);
	}

	const { data: presetWord } = await apiRequest(`/api/v1/backoffice/preset-words/${id}`, presetWordSchema, {
		method: 'PATCH',
		body: formData,
	});

	return presetWord;
};

export const deletePresetWord = async ({ id }: { id: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/preset-words/${id}`, z.unknown(), { method: 'DELETE' });
};

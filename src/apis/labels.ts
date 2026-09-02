import {
	CreateLabelCategoryRequest,
	CreateLabelOptionRequest,
	GetLabelListResponse,
	UpdateLabelCategoryRequest,
	UpdateLabelOptionRequest,
} from '@/types/apis/labels';

import { getAuthHeader } from '@/lib/auth';
import fetcher from '@/lib/fetcher';
import { snakelize } from '@/lib/utils';

export const getLabelList = async (password?: string): Promise<GetLabelListResponse> => {
	return await fetcher('/api/v1/backoffice/labels', {
		headers: getAuthHeader(password),
	});
};

export const createLabelCategory = async (
	data: CreateLabelCategoryRequest,
	password?: string,
): Promise<GetLabelListResponse> => {
	return await fetcher('/api/v1/backoffice/labels/categories', {
		method: 'POST',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const updateLabelCategory = async (
	categoryId: string,
	data: UpdateLabelCategoryRequest,
	password?: string,
): Promise<GetLabelListResponse> => {
	return await fetcher(`/api/v1/backoffice/labels/categories/${categoryId}`, {
		method: 'PATCH',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const deleteLabelCategory = async (categoryId: string, password?: string): Promise<GetLabelListResponse> => {
	return await fetcher(`/api/v1/backoffice/labels/categories/${categoryId}`, {
		method: 'DELETE',
		headers: getAuthHeader(password),
	});
};

export const createLabelOption = async (
	categoryId: string,
	data: CreateLabelOptionRequest,
	password?: string,
): Promise<GetLabelListResponse> => {
	return await fetcher(`/api/v1/backoffice/labels/categories/${categoryId}/options`, {
		method: 'POST',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const updateLabelOption = async (
	optionId: string,
	data: UpdateLabelOptionRequest,
	password?: string,
): Promise<GetLabelListResponse> => {
	return await fetcher(`/api/v1/backoffice/labels/options/${optionId}`, {
		method: 'PATCH',
		headers: getAuthHeader(password),
		body: JSON.stringify(snakelize(data)),
	});
};

export const deleteLabelOption = async (optionId: string, password?: string): Promise<GetLabelListResponse> => {
	return await fetcher(`/api/v1/backoffice/labels/options/${optionId}`, {
		method: 'DELETE',
		headers: getAuthHeader(password),
	});
};

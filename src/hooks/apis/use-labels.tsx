import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';

import {
	createLabelCategory,
	createLabelOption,
	deleteLabelCategory,
	deleteLabelOption,
	getLabelList,
	updateLabelCategory,
	updateLabelOption,
} from '@/apis/labels';

import {
	CreateLabelCategoryRequest,
	CreateLabelOptionRequest,
	UpdateLabelCategoryRequest,
	UpdateLabelOptionRequest,
} from '@/types/apis/labels';

import { getQueryClient } from '@/lib/react-query';

export const getLabelListOptions = (password?: string) =>
	queryOptions({
		queryKey: ['labels', password],
		queryFn: () => getLabelList(password).then((res) => res.data),
	});

export const useGetLabelList = () => {
	return useSuspenseQuery(getLabelListOptions());
};

export const useCreateLabelCategory = () => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: (data: CreateLabelCategoryRequest) => createLabelCategory(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
	});
};

export const useUpdateLabelCategory = () => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: ({ categoryId, data }: { categoryId: string; data: UpdateLabelCategoryRequest }) =>
			updateLabelCategory(categoryId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
	});
};

export const useDeleteLabelCategory = () => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: (categoryId: string) => deleteLabelCategory(categoryId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
	});
};

export const useCreateLabelOption = () => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateLabelOptionRequest }) =>
			createLabelOption(categoryId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
	});
};

export const useUpdateLabelOption = () => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: ({ optionId, data }: { optionId: string; data: UpdateLabelOptionRequest }) =>
			updateLabelOption(optionId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
	});
};

export const useDeleteLabelOption = () => {
	const queryClient = getQueryClient();

	return useMutation({
		mutationFn: (optionId: string) => deleteLabelOption(optionId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
	});
};

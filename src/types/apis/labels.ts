import ApiResponse from '@/types/apis';

import { LabelCategory } from '@/types/label';

export interface GetLabelListResponse extends ApiResponse {
	data: LabelCategory[];
}

export interface CreateLabelCategoryRequest {
	name: string;
	displayOrder?: number;
}

export interface UpdateLabelCategoryRequest {
	name?: string;
	displayOrder?: number;
}

export interface CreateLabelOptionRequest {
	name: string;
	displayOrder?: number;
}

export interface UpdateLabelOptionRequest {
	name?: string;
	displayOrder?: number;
}

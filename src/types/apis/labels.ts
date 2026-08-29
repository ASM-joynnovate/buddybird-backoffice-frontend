import ApiResponse from '@/types/apis';

import { LabelCategory, LabelCategoryTargetEnum } from '@/types/label';

export interface GetLabelListResponse extends ApiResponse {
	data: LabelCategory[];
}

export interface CreateLabelCategoryRequest {
	name: string;
	target: LabelCategoryTargetEnum;
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

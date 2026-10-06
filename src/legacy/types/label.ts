export const LabelCategoryTargetEnum = {
	CAPTURE: 'CA',
	SEGMENT: 'SE',
} as const;
export type LabelCategoryTargetEnum = (typeof LabelCategoryTargetEnum)[keyof typeof LabelCategoryTargetEnum];

export const LabelCategoryTargetLabel: Record<LabelCategoryTargetEnum, string> = {
	[LabelCategoryTargetEnum.CAPTURE]: '클립',
	[LabelCategoryTargetEnum.SEGMENT]: '세그먼트',
};

export interface LabelOption {
	id: string;
	name: string;
	displayOrder: number;
}

export interface LabelCategory {
	id: string;
	name: string;
	target: LabelCategoryTargetEnum;
	displayOrder: number;
	options: LabelOption[];
}

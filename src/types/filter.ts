import type { ReactNode } from 'react';

export interface FilterOption {
	value: string | boolean;
	label: string;
	count?: number;
	icon?: ReactNode;
}

export interface FilterGroup {
	name: string;
	label: string;
	options: FilterOption[];
}

export interface SelectedFilter {
	name: string;
	groupLabel?: string;
	label: string;
	icon?: ReactNode;
}

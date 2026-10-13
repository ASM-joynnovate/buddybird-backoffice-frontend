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
	// 숫자를 입력받는 그룹의 입력창 뒤에 적는 단위
	inputUnit?: string;
	// 이 그룹의 값이 바뀌면 함께 지울 그룹
	resetNames?: string[];
}

export interface SelectedFilter {
	name: string;
	groupLabel?: string;
	label: string;
	icon?: ReactNode;
	// 이 조건을 지우면 함께 지울 조건
	resetNames?: string[];
}

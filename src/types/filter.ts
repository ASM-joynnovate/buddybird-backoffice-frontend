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
	// 값을 선택하지 않은 상태의 버튼
	allOption?: { label: string; count?: number };
	// 숫자를 입력받는 그룹의 입력 필드 뒤에 표시할 단위
	inputUnit?: string;
	// 이 그룹의 값이 변경되면 함께 해제할 그룹
	resetNames?: string[];
	// 쉼표로 이은 값 여러 개 선택
	multiple?: boolean;
	// 값을 선택하지 않았을 때 선택된 것으로 표시할 값
	defaultValue?: string;
}

export interface SelectedFilter {
	name: string;
	groupLabel?: string;
	label: string;
	icon?: ReactNode;
	// 이 조건을 해제하면 함께 해제할 조건
	resetNames?: string[];
}

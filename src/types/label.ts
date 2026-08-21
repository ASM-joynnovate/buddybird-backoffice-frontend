export interface LabelOption {
	id: string;
	name: string;
	displayOrder: number;
}

export interface LabelCategory {
	id: string;
	name: string;
	displayOrder: number;
	options: LabelOption[];
}

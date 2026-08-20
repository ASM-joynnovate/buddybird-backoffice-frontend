import { CamelToSnake, SnakeToCamel } from '@/types/common';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** 받은 인자를 스네이크 케이스로 반환하는 함수 (fooBar -> foo_bar) */
export const snakelize = <T>(obj: T): CamelToSnake<T> => {
	if (Array.isArray(obj)) {
		return obj.map((v) => snakelize(v)) as CamelToSnake<T>;
	} else if (typeof obj === 'object' && obj !== null) {
		const newObj: Record<string, unknown> = {};
		for (const key in obj) {
			newObj[key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)] = snakelize(obj[key]);
		}
		return newObj as CamelToSnake<T>;
	}
	return obj as CamelToSnake<T>;
};

/** 받은 인자를 카멜 케이스로 반환하는 함수 (foo_bar -> fooBar) */
export const camelize = <T>(obj: T): SnakeToCamel<T> => {
	if (Array.isArray(obj)) {
		return obj.map((v) => camelize(v)) as SnakeToCamel<T>;
	} else if (typeof obj === 'object' && obj !== null) {
		const newObj: Record<string, unknown> = {};
		for (const key in obj) {
			newObj[key.replace(/_[a-z]/g, (match) => match.slice(1).toUpperCase())] = camelize(obj[key]);
		}
		return newObj as SnakeToCamel<T>;
	}
	return obj as SnakeToCamel<T>;
};

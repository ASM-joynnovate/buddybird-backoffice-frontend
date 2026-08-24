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

export async function downloadFile(url: string) {
	const res = await fetch(url);
	const blob = await res.blob();
	const blobUrl = URL.createObjectURL(blob);
	const filename = new URL(url).pathname.split('/').pop() ?? 'download';
	const a = document.createElement('a');
	a.href = blobUrl;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(blobUrl);
}

export function formatMs(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const millis = ms % 1000;

	return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

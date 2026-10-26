import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** class 이름을 병합하는 함수 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

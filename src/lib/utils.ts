import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** class 이름을 합치는 함수 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

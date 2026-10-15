import { z } from 'zod';

export const localDateSchema = z.iso.date();
export const timestampSchema = z.iso.datetime({ offset: true });
export const timeSchema = z.iso.time();
export const uuidSchema = z.uuid();
// 서버의 기기 언어 형식과 같음
export const localeSchema = z
	.string()
	.max(35)
	.regex(/^[A-Za-z]{2,3}(-[A-Za-z0-9]{1,8})*$/);
export const countrySchema = z.string().regex(/^[A-Z]{2}$/);

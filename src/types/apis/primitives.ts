import { z } from 'zod';

export const localDateSchema = z.iso.date();
export const timestampSchema = z.iso.datetime({ offset: true });
export const timeSchema = z.iso.time();
export const uuidSchema = z.uuid();

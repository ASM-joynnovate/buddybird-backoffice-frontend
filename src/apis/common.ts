import { snakelize } from '@/lib/utils';

export function buildQueryString(params?: Record<string, unknown>): string {
	if (!params) return '';

	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(snakelize(params))) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				searchParams.append(key, String(item));
			}
		} else {
			searchParams.set(key, String(value));
		}
	}

	const query = searchParams.toString();
	return query ? `?${query}` : '';
}

export const BACKOFFICE_COOKIE_NAME = 'backoffice-password';
export const BACKOFFICE_PASSWORD_HEADER = 'X-Backoffice-Password';

const MAX_AGE = 60 * 60 * 24 * 3;

export function getPasswordFromBrowser(): string {
	if (typeof document === 'undefined') return '';
	const match = document.cookie.match(new RegExp(`${BACKOFFICE_COOKIE_NAME}=([^;]+)`));
	return match ? decodeURIComponent(match[1]) : '';
}

export function setPassword(password: string): void {
	document.cookie = `${BACKOFFICE_COOKIE_NAME}=${encodeURIComponent(password)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function clearPassword(): void {
	document.cookie = `${BACKOFFICE_COOKIE_NAME}=; path=/; max-age=0`;
}

export function getAuthHeader(password?: string): Record<string, string> {
	return { [BACKOFFICE_PASSWORD_HEADER]: password ?? getPasswordFromBrowser() };
}

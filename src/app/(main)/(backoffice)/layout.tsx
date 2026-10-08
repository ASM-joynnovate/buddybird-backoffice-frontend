import { cookies } from 'next/headers';

import { THEME_COOKIE_NAME, toTheme } from '@/lib/theme';

import Sidebar from '@/components/sidebar';

/**
 * 메뉴가 있는 백오피스 공통 레이아웃
 * @param children
 */
export default async function Layout({ children }: LayoutProps<'/'>) {
	const cookieStore = await cookies();
	const theme = toTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

	return (
		<div className="flex min-h-full flex-1 flex-col md:flex-row">
			<Sidebar theme={theme} />

			<main className="min-w-0 flex-1 space-y-4 p-4 md:p-8">{children}</main>
		</div>
	);
}

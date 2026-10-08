import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';

import { THEME_COOKIE_NAME, toTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

import '@/app/(main)/globals.css';
import Providers from '@/providers';

export const metadata: Metadata = {
	title: '버디버드 백오피스',
};

const pretendard = localFont({
	src: '../../../public/fonts/pretendard/PretendardVariable.woff2',
	display: 'swap',
	weight: '100 900',
	variable: '--font-pretendard',
});

/**
 * 새 백오피스 화면의 root 레이아웃
 * @param children
 */
export default async function RootLayout({ children }: LayoutProps<'/'>) {
	const cookieStore = await cookies();
	const theme = toTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

	return (
		<html lang="ko" className={cn(pretendard.variable, theme, 'h-full antialiased')}>
			<body className="flex min-h-full flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

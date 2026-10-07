import type { Metadata } from 'next';
import localFont from 'next/font/local';

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
export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

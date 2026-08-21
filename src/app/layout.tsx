import type { Metadata } from 'next';
import localFont from 'next/font/local';

import Providers from '@/providers';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
	title: '버디버드 백오피스',
	description: '버디버드에 필요한 오디오 라벨링을 위한 백오피스',
};

const pretendard = localFont({
	src: '../../public/fonts/pretendard/PretendardVariable.woff2',
	display: 'swap',
	weight: '100 900',
	variable: '--font-pretendard',
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col">
				<Providers>{children}</Providers>
				<Toaster richColors expand closeButton />
			</body>
		</html>
	);
}

import Header from '@/components/header';

/**
 * 메뉴가 있는 백오피스 공통 레이아웃
 * @param children
 */
export default function Layout({ children }: LayoutProps<'/'>) {
	return (
		<div className="flex min-h-full flex-col">
			<Header />

			<main className="flex-1 space-y-4 p-4 sm:p-6">{children}</main>
		</div>
	);
}

import Header from '@/legacy/components/header';

export default function Layout({ children }: LayoutProps<'/legacy'>) {
	return (
		<div className="backoffice-layout flex min-h-full flex-col">
			<Header />
			<main className="flex-1 p-4 sm:p-6">{children}</main>
		</div>
	);
}

import Header from '@/components/header';

export default function Layout({ children }: LayoutProps<'/'>) {
	return (
		<div className="flex min-h-full flex-col">
			<Header />
			<main className="flex-1 p-4 sm:p-6">{children}</main>
		</div>
	);
}

export default function Layout({ children }: LayoutProps<'/captures'>) {
	return (
		<div
			data-capture-viewport
			className="min-w-0 capture-desktop:flex capture-desktop:min-h-0 capture-desktop:flex-1
				capture-desktop:flex-col"
		>
			{children}
		</div>
	);
}

import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface CaptureInfoCardProps {
	title: string;
	children: ReactNode;
}

export default function CaptureInfoCard({ title, children }: CaptureInfoCardProps) {
	return (
		<Card>
			<div className="border-b px-4 py-3">
				<span className="text-sm font-semibold">{title}</span>
			</div>
			<CardContent className="p-4">
				<dl className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-6 gap-y-3">{children}</dl>
			</CardContent>
		</Card>
	);
}

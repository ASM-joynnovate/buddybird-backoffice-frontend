import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div
			className="flex min-h-0 flex-1 flex-col gap-4 capture-desktop:overflow-hidden"
			aria-label="캡처 상세 로딩 중"
		>
			<div className="grid min-h-0 flex-1 gap-4 capture-desktop:grid-cols-[minmax(0,1fr)_360px]">
				<div className="flex min-h-0 flex-col gap-4 capture-desktop:overflow-hidden">
					<Skeleton className="h-48 w-full shrink-0" />
					<Skeleton className="min-h-48 w-full flex-1" />
				</div>
				<div className="space-y-3 capture-desktop:overflow-hidden">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-32 w-full" />
					))}
				</div>
			</div>
			<div className="grid shrink-0 grid-cols-2 gap-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	);
}

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div
			className="flex min-h-0 flex-1 flex-col gap-4 capture-desktop:overflow-hidden"
			aria-label="캡처 목록 로딩 중"
		>
			<div className="flex shrink-0 flex-wrap items-center gap-4">
				<Skeleton className="h-10 w-40" />
				<Skeleton className="h-10 w-40" />
				<Skeleton className="h-10 w-40" />
			</div>
			<div className="min-h-0 flex-1 space-y-2 capture-desktop:overflow-hidden">
				{Array.from({ length: 10 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
			<Skeleton className="mx-auto h-8 w-48 shrink-0" />
		</div>
	);
}

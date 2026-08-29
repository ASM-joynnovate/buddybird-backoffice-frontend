import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-16 w-full sm:h-24" />
			<Skeleton className="h-24 w-full sm:h-36" />
			<div className="flex gap-2">
				<Skeleton className="h-9 w-24" />
				<Skeleton className="h-9 w-24" />
			</div>
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-32 w-full lg:h-64" />
		</div>
	);
}

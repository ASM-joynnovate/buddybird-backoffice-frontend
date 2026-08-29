import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="flex flex-1 flex-col gap-4">
			<Skeleton className="h-8 w-32" />
			<Skeleton className="h-64 w-full rounded-lg" />
		</div>
	);
}

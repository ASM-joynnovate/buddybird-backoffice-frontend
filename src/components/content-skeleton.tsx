import { Skeleton } from '@/components/ui/skeleton';

/** 내용을 불러오는 동안 보이는 컴포넌트 */
const ContentSkeleton = () => {
	return (
		<div className="space-y-2">
			<Skeleton className="h-8 w-full" />
			<Skeleton className="h-8 w-full" />
			<Skeleton className="h-8 w-full" />
		</div>
	);
};

export default ContentSkeleton;

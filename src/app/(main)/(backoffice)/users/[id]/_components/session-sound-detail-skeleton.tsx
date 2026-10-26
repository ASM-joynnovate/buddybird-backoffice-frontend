import { Skeleton } from '@/components/ui/skeleton';

/** 선택한 소리의 상세를 불러오는 동안 표시하는 컴포넌트 */
const SessionSoundDetailSkeleton = () => {
	return (
		<>
			<Skeleton className="h-28 rounded-lg" />
			<Skeleton className="h-28 rounded-lg" />
			<Skeleton className="h-56 rounded-lg" />
			<Skeleton className="h-56 rounded-lg" />
		</>
	);
};

export default SessionSoundDetailSkeleton;

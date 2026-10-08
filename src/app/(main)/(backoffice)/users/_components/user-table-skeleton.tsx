import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 12;

/** 사용자 표를 불러오는 동안 보이는 컴포넌트 */
const UserTableSkeleton = () => {
	return (
		<Card className="gap-3 p-4">
			{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
				<Skeleton key={index} className="h-9" />
			))}
		</Card>
	);
};

export default UserTableSkeleton;

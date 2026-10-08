import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 6;

interface Props {
	title: string;
}

/**
 * 보낸 알림 목록을 불러오는 동안 보이는 컴포넌트
 * @param title 카드 제목
 */
const NotificationListSkeleton = ({ title }: Props) => {
	return (
		<TitledCard title={title}>
			{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
				<div
					key={index}
					className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-2 border-t py-3.5 first:border-t-0 md:grid-cols-[86px_70px_minmax(0,1fr)_140px] md:gap-x-3.5"
				>
					<Skeleton className="h-9.5" />
					<Skeleton className="h-5" />
					<Skeleton className="h-9.5 max-md:col-span-full" />
					<Skeleton className="h-9.5 max-md:col-span-full" />
				</div>
			))}
		</TitledCard>
	);
};

export default NotificationListSkeleton;

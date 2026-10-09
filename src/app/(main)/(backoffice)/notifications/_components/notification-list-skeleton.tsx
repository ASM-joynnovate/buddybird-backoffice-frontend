import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;

interface Props {
	title: string;
}

/**
 * 보낸 알림 목록을 불러오는 동안 보이는 컴포넌트
 * @param title 카드 제목
 */
const NotificationListSkeleton = ({ title }: Props) => {
	return (
		<>
			<TitledCard title={title}>
				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<div
						key={index}
						className="grid grid-cols-[auto_minmax(0,1fr)_16px] items-start gap-x-2.5 gap-y-2 border-t py-3.5 first:border-t-0 md:grid-cols-[86px_70px_minmax(0,1fr)_140px_16px] md:gap-x-3.5"
					>
						<div className="max-md:col-start-2 max-md:row-start-1">
							<SkeletonText className="h-5 w-20" />
							<SkeletonText className="w-12 text-[12.5px]" />
						</div>
						<Skeleton className="h-5 w-14 max-md:col-start-1 max-md:row-start-1" />
						<div className="max-md:col-span-full">
							<SkeletonText className="h-5 w-3/5" />
							<SkeletonText className="text-[13px]" />
							<SkeletonText className="w-4/5 text-[13px]" />
						</div>
						<SkeletonText className="h-5 w-24 justify-self-end max-md:col-span-full max-md:justify-self-start" />
					</div>
				))}
			</TitledCard>

			{/*페이지 이동 링크*/}
			<Skeleton className="mx-auto h-9 w-60" />
		</>
	);
};

export default NotificationListSkeleton;

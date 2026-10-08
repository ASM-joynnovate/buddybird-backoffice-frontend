import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_TITLE_WIDTHS = ['62%', '48%', '70%'];

/** 종료된 공지 카드를 불러오는 동안 보이는 컴포넌트 */
const EndedAnnouncementSkeleton = () => {
	return (
		<TitledCard title="종료된 공지">
			{PLACEHOLDER_TITLE_WIDTHS.map((titleWidth) => (
				<div key={titleWidth} className="border-t py-2.5">
					<div className="xl:w-75">
						<Skeleton className="my-1 h-4" style={{ width: titleWidth }} />
						<Skeleton className="my-1 h-3 w-36" />
					</div>
				</div>
			))}
		</TitledCard>
	);
};

export default EndedAnnouncementSkeleton;

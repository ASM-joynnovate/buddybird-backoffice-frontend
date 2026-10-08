import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import {
	announcementGridClassName,
	announcementTableClassName,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROWS = [
	{ titleWidth: '62%', barWidth: '46%' },
	{ titleWidth: '48%', barWidth: '30%' },
	{ titleWidth: '70%', barWidth: '58%' },
];

/** 게시 일정 카드를 불러오는 동안 보이는 컴포넌트 */
const AnnouncementScheduleSkeleton = () => {
	return (
		<TitledCard title="게시 일정">
			<div className="-mx-2 overflow-x-auto px-2">
				<div className={announcementTableClassName}>
					{PLACEHOLDER_ROWS.map(({ titleWidth, barWidth }) => (
						<div key={titleWidth} className={cn(announcementGridClassName, 'border-t py-2.5')}>
							<div>
								<Skeleton className="my-1 h-4" style={{ width: titleWidth }} />
								<Skeleton className="my-1 h-3 w-36" />
							</div>

							<Skeleton className="h-2 rounded-full" style={{ width: barWidth }} />
						</div>
					))}
				</div>
			</div>
		</TitledCard>
	);
};

export default AnnouncementScheduleSkeleton;

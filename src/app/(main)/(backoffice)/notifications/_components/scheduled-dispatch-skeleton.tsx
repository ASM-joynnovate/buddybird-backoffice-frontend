import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

/** "발송 예정"을 불러오는 동안 보이는 컴포넌트 */
const ScheduledDispatchSkeleton = () => {
	return (
		<TitledCard title="발송 예정" action=<span className="text-[13px] text-muted-foreground">한국 시간 기준</span>>
			<Skeleton className="mb-2.5 h-21" />
		</TitledCard>
	);
};

export default ScheduledDispatchSkeleton;

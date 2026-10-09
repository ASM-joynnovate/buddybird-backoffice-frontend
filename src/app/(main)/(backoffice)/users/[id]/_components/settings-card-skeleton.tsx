import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const NOTIFICATION_SETTING_LABELS = ['푸시 알림', '공지 알림', '리포트 알림', '마케팅 알림', '야간 마케팅 알림'];

/** 수면 시간 및 알림 설정 카드를 불러오는 동안 보이는 컴포넌트 */
const SettingsCardSkeleton = () => {
	return (
		<TitledCard title="설정">
			<div className="mb-1 border-b pb-3">
				<div className="mb-2.5 flex justify-between gap-3">
					<span className="text-muted-foreground">수면 시간</span>
					<SkeletonText className="h-5 w-24" />
				</div>

				<Skeleton className="h-2 rounded-full" />

				<ol
					aria-hidden
					className="mt-1.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums"
				>
					<li>0시</li>
					<li>6시</li>
					<li>12시</li>
					<li>18시</li>
					<li>24시</li>
				</ol>
			</div>

			<ul className="divide-y">
				{NOTIFICATION_SETTING_LABELS.map((label) => (
					<li key={label} className="flex items-center justify-between gap-3 py-2 last:pb-0">
						<span className="text-muted-foreground">{label}</span>
						<Skeleton className="h-4 w-7 rounded-full" />
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default SettingsCardSkeleton;

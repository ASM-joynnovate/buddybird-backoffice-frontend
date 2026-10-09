import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_DEVICE_COUNT = 2;
const INFO_LABELS = ['OS', '앱 버전', '최근 접속', '푸시', '언어', '시간대'];

/** 기기 카드를 불러오는 동안 보이는 컴포넌트 */
const DeviceCardSkeleton = () => {
	return (
		<TitledCard title="기기" action=<Skeleton className="h-4 w-6" />>
			<ul className="divide-y">
				{Array.from({ length: PLACEHOLDER_DEVICE_COUNT }, (_, index) => (
					<li key={index} className="py-3 first:pt-0 last:pb-0">
						<SkeletonText className="mb-2 h-5 w-28" />

						<dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
							{INFO_LABELS.map((label) => (
								<div key={label} className="flex min-w-0 justify-between gap-2">
									<dt className="whitespace-nowrap text-muted-foreground">{label}</dt>
									<dd>
										<SkeletonText className="w-14" />
									</dd>
								</div>
							))}
						</dl>

						<SkeletonText className="mt-2 w-24 text-[13px]" />
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default DeviceCardSkeleton;

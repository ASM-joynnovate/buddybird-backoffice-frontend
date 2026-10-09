import { Fragment } from 'react';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { deviceGroupGridClassName } from '@/app/(main)/(backoffice)/app-updates/_components/device-group-cell';
import DeviceGroupLabel, { DEVICE_GROUPS } from '@/app/(main)/(backoffice)/app-updates/_components/device-group-label';
import ReferenceVersion from '@/app/(main)/(backoffice)/app-updates/_components/reference-version';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

// 묶음마다 표시할 버전 행 수
const PLACEHOLDER_CELLS = [
	{ deviceGroup: 'latest', versionCount: 1 },
	{ deviceGroup: 'optional', versionCount: 2 },
	{ deviceGroup: 'forced', versionCount: 3 },
] as const;

// 묶음 사이의 기준 버전
const REFERENCE_VERSIONS = [
	{ name: '최신 버전', description: '낮은 버전에 선택 업데이트' },
	{ name: '최소 지원 버전', description: '낮은 버전에 강제 업데이트' },
];

/** "앱 버전" 카드를 불러오는 동안 보이는 컴포넌트 */
const DeviceGroupSkeleton = () => {
	return (
		<TitledCard title="앱 버전" action=<Skeleton className="h-3.5 w-18" />>
			<div className="@container">
				<div className={deviceGroupGridClassName}>
					{PLACEHOLDER_CELLS.map(({ deviceGroup, versionCount }, index) => (
						<Fragment key={deviceGroup}>
							<div
								className={cn(
									'min-w-0 rounded-lg px-3 pt-2.5 pb-3',
									DEVICE_GROUPS[deviceGroup].className,
								)}
							>
								<DeviceGroupLabel deviceGroup={deviceGroup} />

								{/*기기 수 줄, "대" 글자와 기준선을 맞춘 실제 줄과 같은 높이*/}
								<div className="mt-1.5 flex items-baseline text-[26px] leading-9">
									<span>
										{/*기준선을 유지하도록 줄 위쪽에 정렬*/}
										<SkeletonText className="inline-flex w-24 align-top *:bg-card" />
									</span>
									<span className="text-[13px]">&nbsp;</span>
								</div>

								<Skeleton className="mt-1.5 h-1 rounded-full bg-card" />

								<ul className="mt-2.5 border-t border-foreground/8 pt-1.5 text-[13px]">
									{Array.from({ length: versionCount }, (_, rowIndex) => (
										<li key={rowIndex} className="py-0.75">
											<SkeletonText className="w-full *:bg-card" />
										</li>
									))}
								</ul>
							</div>

							{index < REFERENCE_VERSIONS.length && (
								<ReferenceVersion
									name={REFERENCE_VERSIONS[index].name}
									version=<Skeleton className="inline-block h-4 w-12 align-middle" />
									description={REFERENCE_VERSIONS[index].description}
								/>
							)}
						</Fragment>
					))}
				</div>
			</div>
		</TitledCard>
	);
};

export default DeviceGroupSkeleton;

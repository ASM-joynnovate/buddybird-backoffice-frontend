import { cn } from '@/lib/utils';

import { ArrowDown, ArrowUp } from 'lucide-react';

import DeviceGroupLabel, { DEVICE_GROUPS } from '@/app/(main)/(backoffice)/app-updates/_components/device-group-label';
import { countDevices, type DeviceGroups } from '@/utils/app-update';

const DEVICE_GROUP_NAMES = ['latest', 'optional', 'forced'] as const;

interface Props {
	deviceGroups?: DeviceGroups;
	currentDeviceGroups?: DeviceGroups;
	minSupportedVersion?: string;
}

/**
 * 저장한 뒤의 묶음별 기기 수 및 증감 컴포넌트
 * @param deviceGroups 저장한 뒤의 기기 묶음
 * @param currentDeviceGroups 현재 목록으로 나눈 기기 묶음
 * @param minSupportedVersion 저장한 뒤의 최소 지원 버전
 */
const DeviceCountChanges = ({ deviceGroups, currentDeviceGroups, minSupportedVersion }: Props) => {
	return (
		<dl className="grid grid-cols-3 gap-2">
			{DEVICE_GROUP_NAMES.map((deviceGroup) => {
				const deviceCount = countDevices(deviceGroups?.[deviceGroup] ?? []);
				const changedCount = currentDeviceGroups
					? deviceCount - countDevices(currentDeviceGroups[deviceGroup])
					: 0;

				return (
					<div
						key={deviceGroup}
						className={cn('min-w-0 rounded-lg px-3 py-2.5', DEVICE_GROUPS[deviceGroup].className)}
					>
						<dt>
							<DeviceGroupLabel deviceGroup={deviceGroup} />
						</dt>

						<dd className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-lg font-bold tracking-[-0.01em] tabular-nums">
							{deviceGroups ? (
								`${deviceCount.toLocaleString('ko-KR')}대`
							) : (
								<span className="text-muted-foreground">-</span>
							)}

							{changedCount !== 0 && (
								<span
									title="현재 대비"
									className="inline-flex items-center gap-0.5 rounded-sm bg-card pr-1.5 pl-0.5 text-[12.5px] font-bold tracking-normal"
								>
									{changedCount > 0 ? (
										<ArrowUp aria-label="증가" className="size-3.5" />
									) : (
										<ArrowDown aria-label="감소" className="size-3.5" />
									)}
									{Math.abs(changedCount).toLocaleString('ko-KR')}대
								</span>
							)}
						</dd>

						{deviceGroup === 'forced' && !!minSupportedVersion && (
							<dd className="mt-0.5 text-[12.5px] font-semibold text-warning tabular-nums">
								{minSupportedVersion} 미만
							</dd>
						)}
					</div>
				);
			})}
		</dl>
	);
};

export default DeviceCountChanges;

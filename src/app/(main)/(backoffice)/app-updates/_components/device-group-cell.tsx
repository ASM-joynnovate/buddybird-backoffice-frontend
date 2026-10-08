import type { AppUpdateDashboard } from '@/types/apis/dashboard';

import { cn } from '@/lib/utils';

import DeviceGroupLabel, { DEVICE_GROUPS } from '@/app/(main)/(backoffice)/app-updates/_components/device-group-label';
import { VISIBLE_VERSION_COUNT } from '@/config';
import { countDevices, type DeviceGroups } from '@/utils/app-update';

export const deviceGroupGridClassName =
	'grid gap-3 @min-[720px]:grid-cols-[minmax(0,1fr)_148px_minmax(0,1fr)_148px_minmax(0,1fr)]';

interface Props {
	deviceGroup: keyof DeviceGroups;
	versions?: AppUpdateDashboard['versions'];
	deviceCount: number;
}

/**
 * "앱 버전" 카드의 기기 묶음 칸 컴포넌트
 * @param deviceGroup 칸에 표시할 기기 묶음
 * @param versions 묶음에 속한 앱 버전별 기기 수
 * @param deviceCount 플랫폼의 전체 기기 수
 */
const DeviceGroupCell = ({ deviceGroup, versions, deviceCount }: Props) => {
	const { ariaLabel, className, barClassName, trackClassName } = DEVICE_GROUPS[deviceGroup];

	const groupDeviceCount = countDevices(versions ?? []);
	const percent = deviceCount ? Math.round((groupDeviceCount / deviceCount) * 100) : 0;
	const olderVersions = (versions ?? []).slice(VISIBLE_VERSION_COUNT);

	// 나머지 버전은 한 줄로 합침
	const versionRows = [
		...(versions ?? [])
			.slice(0, VISIBLE_VERSION_COUNT)
			.map((version) => ({ name: version.app_version, count: version.count })),
		...(olderVersions.length > 0
			? [{ name: `${olderVersions[0].app_version} 이하`, count: countDevices(olderVersions) }]
			: []),
	];

	return (
		<fieldset aria-label={ariaLabel} className={cn('min-w-0 rounded-lg px-3 pt-2.5 pb-3', className)}>
			<DeviceGroupLabel deviceGroup={deviceGroup} />

			{versions ? (
				<p className="mt-1.5 flex items-baseline gap-0.5 text-[26px] leading-9 font-bold tracking-[-0.02em] whitespace-nowrap tabular-nums">
					{groupDeviceCount.toLocaleString('ko-KR')}
					<span className="text-[13px] font-semibold tracking-normal text-muted-foreground">대</span>
					<span className="ml-auto text-sm tracking-normal">{percent}%</span>
				</p>
			) : (
				<p className="mt-1.5 text-[26px] leading-9 font-bold text-muted-foreground">-</p>
			)}

			<div aria-hidden className={cn('mt-1.5 h-1 rounded-full', trackClassName)}>
				<div className={cn('h-full rounded-full', barClassName)} style={{ width: `${percent}%` }} />
			</div>

			{!!versions && (
				<ul className="mt-2.5 border-t border-foreground/8 pt-1.5 text-[13px] tabular-nums">
					{versionRows.map((versionRow) => (
						<li key={versionRow.name} className="flex items-baseline justify-between gap-2 py-0.75">
							<span className="font-medium text-muted-foreground">{versionRow.name}</span>
							<strong className="font-bold">{versionRow.count.toLocaleString('ko-KR')}대</strong>
						</li>
					))}

					{versionRows.length === 0 && <li className="py-0.75 text-muted-foreground">해당하는 기기 없음</li>}
				</ul>
			)}
		</fieldset>
	);
};

export default DeviceGroupCell;

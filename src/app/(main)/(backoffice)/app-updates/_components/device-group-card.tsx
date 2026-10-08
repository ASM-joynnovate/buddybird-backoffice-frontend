'use client';

import type { Platform } from '@/types/apis/app-updates';

import { useGetAppUpdateList } from '@/hooks/apis/app-updates';
import { useGetAppUpdateDashboard } from '@/hooks/apis/dashboard';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import DeviceGroupCell, {
	deviceGroupGridClassName,
} from '@/app/(main)/(backoffice)/app-updates/_components/device-group-cell';
import ReferenceVersion from '@/app/(main)/(backoffice)/app-updates/_components/reference-version';
import { countDevices, groupDevices, toVersionPolicy } from '@/utils/app-update';

interface Props {
	platform: Platform;
}

/**
 * 기기를 앱 버전에 따라 나눈 "앱 버전" 카드 컴포넌트
 * @param platform 선택된 플랫폼
 */
const DeviceGroupCard = ({ platform }: Props) => {
	const { data: appUpdateListData } = useGetAppUpdateList({ platform });
	const { data: appUpdateDashboardData } = useGetAppUpdateDashboard({ platform });

	const versionPolicy = toVersionPolicy(appUpdateListData);
	const deviceGroups = groupDevices(appUpdateDashboardData.versions, versionPolicy);
	const deviceCount = countDevices(appUpdateDashboardData.versions);

	// 등록된 업데이트가 없으면 "-" 표시
	const minSupportedVersionText = versionPolicy.latestVersion ? (versionPolicy.minSupportedVersion ?? '없음') : '-';

	return (
		<TitledCard
			title="앱 버전"
			action=<span className="text-[13px] text-muted-foreground tabular-nums">
				기기 {deviceCount.toLocaleString('ko-KR')}대
			</span>
		>
			<div className="@container">
				<div className={deviceGroupGridClassName}>
					<DeviceGroupCell deviceGroup="latest" versions={deviceGroups?.latest} deviceCount={deviceCount} />
					<ReferenceVersion
						name="최신 버전"
						version={versionPolicy.latestVersion ?? '-'}
						description="낮은 버전에 선택 업데이트"
					/>
					<DeviceGroupCell
						deviceGroup="optional"
						versions={deviceGroups?.optional}
						deviceCount={deviceCount}
					/>
					<ReferenceVersion
						name="최소 지원 버전"
						version={minSupportedVersionText}
						description="낮은 버전에 강제 업데이트"
					/>
					<DeviceGroupCell deviceGroup="forced" versions={deviceGroups?.forced} deviceCount={deviceCount} />
				</div>
			</div>
		</TitledCard>
	);
};

export default DeviceGroupCard;

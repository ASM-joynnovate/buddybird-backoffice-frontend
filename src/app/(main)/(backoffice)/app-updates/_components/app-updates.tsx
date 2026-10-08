import type { Platform } from '@/types/apis/app-updates';

import AddAppUpdateButton from '@/app/(main)/(backoffice)/app-updates/_components/add-app-update-button';
import AppUpdateHistoryCard from '@/app/(main)/(backoffice)/app-updates/_components/app-update-history-card';
import AppUpdateHistorySkeleton from '@/app/(main)/(backoffice)/app-updates/_components/app-update-history-skeleton';
import DeviceGroupCard from '@/app/(main)/(backoffice)/app-updates/_components/device-group-card';
import DeviceGroupSkeleton from '@/app/(main)/(backoffice)/app-updates/_components/device-group-skeleton';
import PlatformFilter from '@/app/(main)/(backoffice)/app-updates/_components/platform-filter';
import PlatformVersionFilter from '@/app/(main)/(backoffice)/app-updates/_components/platform-version-filter';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	platform: Platform;
	now: number;
}

/**
 * 앱 업데이트 화면 컴포넌트
 * @param platform 선택된 플랫폼
 * @param now 서버가 화면을 그린 시각
 */
const AppUpdates = ({ platform, now }: Props) => {
	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">앱 업데이트</h1>

				<div className="flex flex-wrap items-center gap-2.5">
					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<PlatformFilter platform={platform} />
					>
						<PlatformVersionFilter platform={platform} />
					</ErrorHandlingWrapper>

					<AddAppUpdateButton platform={platform} />
				</div>
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<DeviceGroupSkeleton />>
				<DeviceGroupCard platform={platform} />
			</ErrorHandlingWrapper>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<AppUpdateHistorySkeleton />>
				<AppUpdateHistoryCard platform={platform} now={now} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default AppUpdates;

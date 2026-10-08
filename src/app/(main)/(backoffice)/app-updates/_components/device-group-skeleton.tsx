import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { deviceGroupGridClassName } from '@/app/(main)/(backoffice)/app-updates/_components/device-group-cell';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_HEIGHTS = ['h-33', 'h-19', 'h-33', 'h-19', 'h-33'];

/** "앱 버전" 카드를 불러오는 동안 보이는 컴포넌트 */
const DeviceGroupSkeleton = () => {
	return (
		<TitledCard title="앱 버전">
			<div className="@container">
				<div className={deviceGroupGridClassName}>
					{PLACEHOLDER_HEIGHTS.map((placeholderHeight, index) => (
						<Skeleton key={index} className={placeholderHeight} />
					))}
				</div>
			</div>
		</TitledCard>
	);
};

export default DeviceGroupSkeleton;

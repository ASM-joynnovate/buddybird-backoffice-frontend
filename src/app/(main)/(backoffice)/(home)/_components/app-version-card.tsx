import type { Dashboard } from '@/types/apis/dashboard';

import { cn } from '@/lib/utils';

import { TriangleAlert } from 'lucide-react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { VISIBLE_VERSION_COUNT } from '@/config';
import { compareVersions } from '@/utils/version';

interface Props {
	devices: Dashboard['devices'];
}

/**
 * 앱 버전 카드 컴포넌트
 * @param devices 앱 버전별 기기 집계
 */
const AppVersionCard = ({ devices }: Props) => {
	const deviceCount = devices.versions.reduce((total, version) => total + version.count, 0);
	const sortedVersions = devices.versions.toSorted((a, b) => compareVersions(b.app_version, a.app_version));
	const olderVersions = sortedVersions.slice(VISIBLE_VERSION_COUNT);

	// 최신 버전은 따로, 나머지는 한 줄로 합침
	const versionGroups = [
		...sortedVersions
			.slice(0, VISIBLE_VERSION_COUNT)
			.map((version) => ({ name: version.app_version, count: version.count, merged: false })),
		...(olderVersions.length > 0
			? [
					{
						name: `${olderVersions[0].app_version} 이하`,
						count: olderVersions.reduce((total, version) => total + version.count, 0),
						merged: true,
					},
				]
			: []),
	];

	return (
		<TitledCard title="앱 버전" href="/app-updates" linkLabel="앱 업데이트">
			{versionGroups.length === 0 && <p className="mb-3 text-muted-foreground">기기가 없습니다.</p>}

			<ul className="divide-y tabular-nums">
				{versionGroups.map((versionGroup) => {
					const percent = Math.round((versionGroup.count / deviceCount) * 100);

					return (
						<li key={versionGroup.name} className="py-3 first:pt-0">
							<p className="flex items-baseline gap-2">
								<span className="mr-auto font-semibold">{versionGroup.name}</span>
								<strong className="font-bold">{percent}%</strong>
								<span className="min-w-12 text-right text-[13px] text-muted-foreground">
									{versionGroup.count.toLocaleString('ko-KR')}대
								</span>
							</p>

							<div aria-hidden className="mt-2 h-2 rounded-full bg-muted">
								<div
									className={cn(
										'h-full rounded-full bg-chart-2',
										versionGroup.merged && 'bg-chart-neutral',
									)}
									style={{ width: `${percent}%` }}
								/>
							</div>
						</li>
					);
				})}
			</ul>

			<p className="mt-1 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-[13px]">
				<TriangleAlert className="size-4 text-warning" />
				최소 지원 버전보다 낮은 기기
				<strong className="ml-auto font-bold tabular-nums">
					{devices.unsupported_count.toLocaleString('ko-KR')}대
				</strong>
			</p>
		</TitledCard>
	);
};

export default AppVersionCard;

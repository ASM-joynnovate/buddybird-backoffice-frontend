import Link from 'next/link';

import { type Platform, platformSchema } from '@/types/apis/app-updates';

import { cn } from '@/lib/utils';

import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import { toPlatformName } from '@/utils/platform';

interface Props {
	platform: Platform;
	latestVersions?: Partial<Record<Platform, string>>;
}

/**
 * 플랫폼 선택 컴포넌트
 * @param platform 선택된 플랫폼
 * @param latestVersions 플랫폼별 최신 버전
 */
const PlatformFilter = ({ platform, latestVersions }: Props) => {
	return (
		<nav aria-label="플랫폼" className="inline-flex h-9 rounded-md border bg-card p-0.5 text-sm">
			{platformSchema.options.map((platformOption) => {
				const selected = platformOption === platform;

				return (
					<Link
						key={platformOption}
						href={{ pathname: '/app-updates', query: { platform: platformOption } }}
						scroll={false}
						aria-current={selected ? 'true' : undefined}
						className={cn(
							'inline-flex items-center gap-1.5 rounded-sm px-3.5 font-semibold whitespace-nowrap text-muted-foreground hover:text-foreground',
							selected && 'bg-foreground text-card hover:text-card',
						)}
					>
						<PlatformIcon platform={platformOption} selected={selected} />
						{toPlatformName(platformOption)}

						{/*로딩 중에는 버전을 표시하지 않음*/}
						{!!latestVersions && (
							<span className="font-medium tabular-nums opacity-72">
								{latestVersions[platformOption] ?? '등록 전'}
							</span>
						)}
					</Link>
				);
			})}
		</nav>
	);
};

export default PlatformFilter;

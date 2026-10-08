import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_KIND_COUNT = 4;
const PLACEHOLDER_VERSION_COUNT = 3;
const PLACEHOLDER_LINE_WIDTHS = [52, 88, 0, 34, 92, 78, 0, 30, 84];

/** 종류 카드 및 상세 카드를 불러오는 동안 보이는 컴포넌트 */
const ConsentCardsSkeleton = () => {
	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
			<TitledCard title="종류">
				<ul className="-mx-2 -mt-2 -mb-4 grid">
					{Array.from({ length: PLACEHOLDER_KIND_COUNT }, (_, index) => (
						<li key={index} className="grid gap-1 px-2 py-4.5">
							<Skeleton className="h-5 w-[62%]" />
							<Skeleton className="h-4 w-[36%]" />
						</li>
					))}
				</ul>
			</TitledCard>

			<Card className="gap-0 px-5 py-4.5">
				<Skeleton className="h-5.5 w-40" />
				<Skeleton className="mt-1.5 h-4 w-30" />

				<div className="mt-3.5 grid grid-cols-3 gap-2">
					{Array.from({ length: PLACEHOLDER_VERSION_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-16.5 rounded-lg" />
					))}
				</div>

				<hr className="-mx-5 my-4.5" />

				<Skeleton className="h-6 w-50" />
				<Skeleton className="mt-4.5 mb-3.5 h-7 w-55" />
				{PLACEHOLDER_LINE_WIDTHS.map((width, index) => (
					<Skeleton
						key={index}
						className={width ? 'mt-2 h-4 max-w-[68ch]' : 'mt-2 h-1'}
						style={{ width: `${width}%` }}
					/>
				))}
			</Card>
		</div>
	);
};

export default ConsentCardsSkeleton;

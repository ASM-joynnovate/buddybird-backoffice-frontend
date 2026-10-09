import { Plus } from 'lucide-react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { kindRowClassName } from '@/app/(main)/(backoffice)/consents/_components/consent-kind-row';
import ConsentStatsSkeleton from '@/app/(main)/(backoffice)/consents/_components/consent-stats-skeleton';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_KIND_COUNT = 4;
const PLACEHOLDER_VERSION_COUNT = 3;
const PLACEHOLDER_LINE_WIDTHS = [52, 88, 0, 34, 92, 78, 0, 30, 84];

/** 종류 카드 및 상세 카드를 불러오는 동안 보이는 컴포넌트 */
const ConsentCardsSkeleton = () => {
	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
			<TitledCard title="종류" action=<Skeleton className="h-3.5 w-5" /> className="xl:sticky xl:top-8">
				<ul className="-mx-2 -mt-2 -mb-4 grid">
					{Array.from({ length: PLACEHOLDER_KIND_COUNT }, (_, index) => (
						<li key={index} className={kindRowClassName}>
							<div className="grid gap-0.5 px-2 py-2.5">
								<SkeletonText className="w-[62%]" />
								<SkeletonText className="w-[36%] text-[13px]" />
							</div>
						</li>
					))}
				</ul>
			</TitledCard>

			<Card className="gap-3.5 py-4.5">
				<CardHeader className="gap-0 px-5">
					<CardTitle>
						<SkeletonText className="w-40" />
					</CardTitle>
					<CardDescription className="text-[13px]">
						<SkeletonText className="w-30" />
					</CardDescription>

					<CardAction>
						<Button variant="outline" disabled>
							<Plus />
							새 버전
						</Button>
					</CardAction>
				</CardHeader>

				<CardContent className="px-5">
					<div className="grid auto-cols-[max(184px,calc((100%_-_16px)/3))] grid-flow-col gap-2 overflow-hidden">
						{Array.from({ length: PLACEHOLDER_VERSION_COUNT }, (_, index) => (
							<div key={index} className="grid gap-0.5 rounded-lg bg-muted px-3.5 py-2.5">
								<SkeletonText className="w-16 text-lg leading-normal *:bg-card" />
								<SkeletonText className="w-28 text-[12.5px] *:bg-card" />
							</div>
						))}
					</div>

					<hr className="-mx-5 my-4.5" />

					<div className="flex min-h-7 items-center justify-between gap-3">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-4 w-28" />
					</div>

					<ConsentStatsSkeleton />

					<div className="mt-4.5 overflow-hidden rounded-lg border">
						<div className="flex items-center gap-2 border-b bg-muted px-3 py-2 max-md:px-2">
							<Skeleton className="h-7 w-25.5 bg-card" />
							<Skeleton className="ml-auto size-7 bg-card" />
						</div>

						<div className="pt-4.5 pr-5 pb-5 pl-8 leading-[1.75] max-md:pr-4 max-md:pl-7">
							<SkeletonText className="mb-3 w-55 text-lg leading-[1.4]" />

							{PLACEHOLDER_LINE_WIDTHS.map((width, index) =>
								width ? (
									<div key={index} className="max-w-[68ch]">
										<SkeletonText style={{ width: `${width}%` }} />
									</div>
								) : (
									<div key={index} className="h-3" />
								),
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConsentCardsSkeleton;

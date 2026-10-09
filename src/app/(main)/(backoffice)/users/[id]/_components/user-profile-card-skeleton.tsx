import { Card } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const factClassName = 'grid min-w-0 content-start gap-1 rounded-lg bg-muted px-3.5 py-2.5';
const factTitleClassName = 'mb-1 text-[12.5px] text-muted-foreground';

/** 사용자 프로필 카드를 불러오는 동안 보이는 컴포넌트 */
const UserProfileCardSkeleton = () => {
	return (
		<Card className="gap-4 px-5 py-4.5">
			<div className="flex flex-wrap items-center gap-3.5">
				<Skeleton className="size-14 rounded-full" />

				<div>
					<SkeletonText className="my-1 h-6 w-24" />
					<SkeletonText className="h-5 w-32" />
				</div>

				<div className="flex gap-2 max-md:w-full max-md:*:flex-1 md:ml-auto">
					<Skeleton className="h-9 w-29" />
					<Skeleton className="h-9 w-29" />
				</div>
			</div>

			<dl className="grid grid-cols-2 gap-2 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
				<div className={`${factClassName} max-md:col-span-2`}>
					<dt className={factTitleClassName}>사용자 ID</dt>
					{/*좁은 화면에서는 사용자 ID가 두 줄로 표시됨*/}
					<dd className="min-w-0">
						<SkeletonText className="h-6 w-80 max-w-full *:bg-background" />
						<SkeletonText className="h-6 w-80 max-w-full *:bg-background xl:hidden" />
					</dd>
					<dd className="text-[12.5px] text-muted-foreground">Sentry 및 피드백에 표시되는 값</dd>
				</div>

				<div className={factClassName}>
					<dt className={factTitleClassName}>로그인</dt>
					<dd className="flex flex-wrap gap-1.5 py-0.5">
						<Skeleton className="h-6 w-20 rounded-full bg-background" />
						<Skeleton className="h-6 w-19 rounded-full bg-background" />
					</dd>
					<dd>
						<SkeletonText className="w-28 text-[12.5px] *:bg-background" />
					</dd>
				</div>

				{['가입', '최근 접속'].map((title) => (
					<div key={title} className={factClassName}>
						<dt className={factTitleClassName}>{title}</dt>
						<dd>
							<SkeletonText className="h-6 w-20 *:bg-background" />
						</dd>
						<dd>
							<SkeletonText className="w-28 text-[12.5px] *:bg-background" />
						</dd>
					</div>
				))}
			</dl>
		</Card>
	);
};

export default UserProfileCardSkeleton;

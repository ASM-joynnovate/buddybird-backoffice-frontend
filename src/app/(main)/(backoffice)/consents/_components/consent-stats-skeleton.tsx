import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

// 동의, 거부, 접속 후 미응답, 접속 없음, 전체
const PLACEHOLDER_DECISION_ROW_COUNT = 5;
const PLACEHOLDER_RATE_ROW_COUNT = 2;
const RATE_GROUP_NAMES = ['버전', '기기', '언어'];

const sectionClassName = 'min-w-0 px-4 pt-3.5 pb-4';
const sectionTitleClassName = 'text-[13px] font-semibold';

/** 동의 통계를 불러오는 동안 보이는 컴포넌트 */
const ConsentStatsSkeleton = () => {
	return (
		<div className="mt-4 grid rounded-lg border md:grid-cols-[264px_minmax(0,1fr)]">
			<section className={sectionClassName}>
				<h4 className={`${sectionTitleClassName} mb-2.5`}>동의 현황</h4>

				<Skeleton className="mx-auto mt-1 h-26 w-52.5 max-w-full rounded-t-full" />

				<ul className="mt-3 divide-y text-[13px]">
					{Array.from({ length: PLACEHOLDER_DECISION_ROW_COUNT }, (_, index) => (
						<li key={index} className="py-1.5">
							<SkeletonText className="w-full" />
						</li>
					))}
				</ul>
			</section>

			<div className="grid grid-cols-[minmax(0,1fr)] content-start max-md:border-t md:border-l">
				<section className={sectionClassName}>
					<div className="mb-2.5 flex items-baseline justify-between gap-3">
						<h4 className={sectionTitleClassName}>동의 추이</h4>
						<Skeleton className="h-3 w-10" />
					</div>

					<Skeleton className="h-38" />
				</section>

				<section className={`${sectionClassName} border-t`}>
					<h4 className={`${sectionTitleClassName} mb-2.5`}>동의율</h4>

					<div className="grid grid-cols-[repeat(auto-fit,minmax(132px,1fr))] gap-x-6 gap-y-3">
						{RATE_GROUP_NAMES.map((rateGroupName) => (
							<div key={rateGroupName}>
								<h5 className="mb-1.5 text-[12.5px] text-muted-foreground">{rateGroupName}</h5>

								<ul className="grid gap-1.5 text-[13px]">
									{Array.from({ length: PLACEHOLDER_RATE_ROW_COUNT }, (_, index) => (
										<li key={index}>
											<Skeleton className="inline-block h-2 w-full align-middle" />
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default ConsentStatsSkeleton;

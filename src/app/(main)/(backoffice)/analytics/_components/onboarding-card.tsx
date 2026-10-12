import type { AnalyticsDashboard } from '@/types/apis/dashboard';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { ONBOARDING_STEPS } from '@/config/analytics';

interface Props {
	onboarding: AnalyticsDashboard['onboarding'];
}

/**
 * 온보딩 단계별 조회 및 완료 카드 컴포넌트
 * @param onboarding 단계별 조회 및 완료 사용자 수
 */
const OnboardingCard = ({ onboarding }: Props) => {
	const stepCounts = [
		...ONBOARDING_STEPS.map(({ step, label }) => {
			const stepCount = onboarding.find((onboardingStep) => onboardingStep.step === step);

			return {
				label,
				viewedCount: stepCount?.viewed_count ?? 0,
				completedCount: stepCount?.completed_count ?? 0,
			};
		}),
		// 한국어 이름이 없는 단계는 서버의 이름 그대로 표시
		...onboarding
			.filter(({ step }) => !ONBOARDING_STEPS.some((onboardingStep) => onboardingStep.step === step))
			.map(({ step, viewed_count, completed_count }) => ({
				label: step,
				viewedCount: viewed_count,
				completedCount: completed_count,
			})),
	];

	const startedCount = stepCounts[0].viewedCount;
	const finishedCount = stepCounts[ONBOARDING_STEPS.length - 1].completedCount;

	return (
		<TitledCard title="온보딩" action=<span className="text-[13px] text-muted-foreground">Google Analytics</span>>
			<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="text-[30px] leading-[1.2] font-bold tracking-[-0.02em] tabular-nums">
						{startedCount > 0 ? Math.round((finishedCount / startedCount) * 100) : '-'}
						{startedCount > 0 && (
							<span className="ml-0.5 text-base font-semibold tracking-normal text-muted-foreground">
								%
							</span>
						)}
					</p>
					<p className="text-[13px] text-muted-foreground tabular-nums">
						{startedCount > 0
							? `시작한 ${startedCount.toLocaleString('ko-KR')}명 중 ${finishedCount.toLocaleString('ko-KR')}명 완료`
							: '온보딩을 시작한 사용자가 없습니다.'}
					</p>
				</div>

				<div className="flex gap-4 text-[13px] text-muted-foreground">
					<span className="inline-flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-chart-1/30" />
						조회
					</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-chart-1" />
						완료
					</span>
				</div>
			</div>

			<ol className="@container grid gap-2.5 tabular-nums">
				{stepCounts.map((stepCount) => (
					<li
						key={stepCount.label}
						className="grid grid-cols-[132px_minmax(0,1fr)_56px_40px] items-center gap-2.5 @max-[420px]:grid-cols-[100px_minmax(0,1fr)_52px_36px]"
					>
						<span title={stepCount.label} className="truncate text-[13px] text-muted-foreground">
							{stepCount.label}
						</span>

						{/*조회한 사용자 위에 완료한 사용자를 겹쳐 표시*/}
						<div aria-hidden className="relative h-2 overflow-hidden rounded-full bg-muted">
							<div
								className="absolute inset-y-0 left-0 rounded-full bg-chart-1/30"
								style={{
									width: `${startedCount > 0 ? (stepCount.viewedCount / startedCount) * 100 : 0}%`,
								}}
							/>
							<div
								className="absolute inset-y-0 left-0 rounded-full bg-chart-1"
								style={{
									width: `${startedCount > 0 ? (stepCount.completedCount / startedCount) * 100 : 0}%`,
								}}
							/>
						</div>

						<strong className="text-right font-bold">
							{stepCount.completedCount.toLocaleString('ko-KR')}명
						</strong>
						<span className="text-right text-[13px] text-muted-foreground">
							{stepCount.viewedCount > 0 &&
								`${Math.round((stepCount.completedCount / stepCount.viewedCount) * 100)}%`}
						</span>
					</li>
				))}
			</ol>
		</TitledCard>
	);
};

export default OnboardingCard;

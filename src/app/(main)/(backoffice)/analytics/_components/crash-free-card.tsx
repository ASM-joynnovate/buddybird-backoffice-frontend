import type { StabilityDashboard } from '@/types/apis/dashboard';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

/** 0부터 1까지의 비율을 소수 둘째 자리까지의 %로 변환하는 함수 */
const toPercentText = (rate: number) => {
	return (rate * 100).toFixed(2);
};

interface Props {
	projects: StabilityDashboard['projects'];
	releases: StabilityDashboard['releases'];
}

/**
 * 충돌 없는 사용자 비율 및 릴리스별 비율 카드 컴포넌트
 * @param projects 프로젝트별 충돌 없는 비율
 * @param releases 사용자가 많은 순서의 릴리스 목록
 */
const CrashFreeCard = ({ projects, releases }: Props) => {
	// 세션을 기록하는 프로젝트는 앱 하나
	const sessionProject = projects.find((project) => project.crash_free_user_rate !== null);
	const crashFreeUserRate = sessionProject?.crash_free_user_rate ?? null;
	const crashFreeSessionRate = sessionProject?.crash_free_session_rate ?? null;

	const maxCrashRate = Math.max(0.0001, ...releases.map((release) => 1 - (release.crash_free_user_rate ?? 1)));

	return (
		<TitledCard title="충돌 없는 사용자" action=<span className="text-[13px] text-muted-foreground">Sentry</span>>
			<div className="mb-4.5 flex items-end justify-between gap-3">
				<p className="text-[30px] leading-[1.2] font-bold tracking-[-0.02em] tabular-nums">
					{crashFreeUserRate === null ? '-' : toPercentText(crashFreeUserRate)}
					{crashFreeUserRate !== null && (
						<span className="ml-0.5 text-base font-semibold tracking-normal text-muted-foreground">%</span>
					)}
				</p>
				<p className="text-[13px] text-muted-foreground tabular-nums">
					{crashFreeSessionRate === null
						? '세션 기록이 없습니다.'
						: `세션 기준 ${toPercentText(crashFreeSessionRate)}%`}
				</p>
			</div>

			<h3 className="text-[13px] font-semibold">릴리스</h3>

			{releases.length === 0 && (
				<p className="mt-2 text-muted-foreground">조회 기간에 접속한 릴리스가 없습니다.</p>
			)}

			<ul className="mt-2 grid gap-2.5 tabular-nums">
				{releases.map(({ release, crash_free_user_rate, user_count }) => {
					// "패키지@버전+빌드" 형식
					const [version, build] = release.slice(release.lastIndexOf('@') + 1).split('+');

					return (
						<li
							key={release}
							className="grid grid-cols-[76px_minmax(0,1fr)_64px_52px] items-center gap-2.5 whitespace-nowrap"
						>
							<span title={release} className="truncate font-semibold">
								{version}
								{!!build && <span className="ml-1 font-normal text-muted-foreground">{build}</span>}
							</span>

							<div
								title={
									crash_free_user_rate === null
										? undefined
										: `충돌을 겪은 사용자 ${toPercentText(1 - crash_free_user_rate)}%`
								}
								className="h-2 rounded-full bg-muted"
							>
								<div
									className="h-full rounded-full bg-destructive-dot"
									style={{ width: `${((1 - (crash_free_user_rate ?? 1)) / maxCrashRate) * 100}%` }}
								/>
							</div>

							<strong className="text-right font-bold">
								{crash_free_user_rate === null ? '-' : `${toPercentText(crash_free_user_rate)}%`}
							</strong>
							<span className="text-right text-[13px] text-muted-foreground">
								{user_count.toLocaleString('ko-KR')}명
							</span>
						</li>
					);
				})}
			</ul>
		</TitledCard>
	);
};

export default CrashFreeCard;

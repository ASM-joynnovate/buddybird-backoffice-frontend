import type { StabilityDashboard } from '@/types/apis/dashboard';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

interface Props {
	projects: StabilityDashboard['projects'];
}

/**
 * 프로젝트별 오류 수 카드 컴포넌트
 * @param projects 프로젝트별 오류 수
 */
const ProjectErrorCard = ({ projects }: Props) => {
	const maxErrorCount = Math.max(1, ...projects.map((project) => project.error_count));

	return (
		<TitledCard title="프로젝트별 오류" action=<span className="text-[13px] text-muted-foreground">Sentry</span>>
			<ul className="grid gap-2.5">
				{projects
					.toSorted((a, b) => b.error_count - a.error_count)
					.map(({ project, error_count }) => (
						<li key={project} className="grid grid-cols-[156px_minmax(0,1fr)_48px] items-center gap-2.5">
							<span title={project} className="truncate font-semibold">
								{project}
							</span>

							<div aria-hidden className="h-2 rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-destructive-dot"
									style={{ width: `${(error_count / maxErrorCount) * 100}%` }}
								/>
							</div>

							<strong className="text-right font-bold tabular-nums">
								{error_count.toLocaleString('ko-KR')}
							</strong>
						</li>
					))}
			</ul>
		</TitledCard>
	);
};

export default ProjectErrorCard;

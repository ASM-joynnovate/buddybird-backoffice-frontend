import Link from 'next/link';

import type { StabilityDashboard, StabilityIssueSort } from '@/types/apis/dashboard';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import { Check, ChevronDown, ExternalLink, ListFilter } from 'lucide-react';

import FilterButton from '@/app/(main)/(backoffice)/_components/filter-button';
import FilterPanel from '@/app/(main)/(backoffice)/_components/filter-panel';
import SelectedFilters from '@/app/(main)/(backoffice)/_components/selected-filters';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { ISSUE_SORT_LABELS } from '@/config/analytics';
import { formatDate, formatRelativeTime, formatShortDate } from '@/utils/date';
import { toLinkQuery } from '@/utils/search-params';
import { toIssueFilterGroups, toIssueLevel, toReleaseVersion } from '@/utils/stability';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

const HEAD_COLUMNS = [
	{ sort: 'freq', label: '발생' },
	{ sort: undefined, label: '첫 발생' },
	{ sort: 'date', label: '마지막 발생' },
] satisfies { sort?: StabilityIssueSort; label: string }[];

// 열: 등급, 이슈, 빈 열, 프로젝트, 발생, 첫 발생, 마지막 발생, 링크
const rowClassName = cn(
	'grid grid-cols-[44px_minmax(0,4.4fr)_var(--issue-gap)_128px_minmax(126px,1.6fr)_minmax(48px,0.8fr)_minmax(74px,1fr)_28px] items-start gap-3',
	'@max-[899px]:grid-cols-[44px_minmax(0,4.4fr)_var(--issue-gap)_128px_52px_minmax(48px,0.8fr)_minmax(74px,1fr)_28px]',
);

interface Props {
	issues: StabilityDashboard['issues'];
	projects: StabilityDashboard['projects'];
	issueReleases: StabilityDashboard['issue_releases'];
	sort: StabilityIssueSort;
	project?: string;
	dateFrom: string;
	query: Record<string, SearchParamValue>;
	now: number;
}

/**
 * Sentry 이슈 목록 카드 컴포넌트
 * @param issues 정렬 기준 및 필터에 맞는 이슈 목록
 * @param projects 프로젝트 목록
 * @param issueReleases 이슈가 발생한 릴리스 목록
 * @param sort 이슈 정렬 기준
 * @param project 필터로 선택한 프로젝트
 * @param dateFrom 조회 기간의 시작일
 * @param query 현재 주소의 쿼리
 * @param now 서버가 화면을 그린 시각
 */
const IssueCard = ({ issues, projects, issueReleases, sort, project, dateFrom, query, now }: Props) => {
	const maxCount = Math.max(1, ...issues.map((issue) => issue.count));

	// 등급 그룹의 값 앞에만 색 점 표시
	const filterGroups = toIssueFilterGroups(projects, issueReleases, project).map((filterGroup) => ({
		...filterGroup,
		options: filterGroup.options.map((filterOption) => ({
			...filterOption,
			icon: filterGroup.name === 'level' && (
				<span
					className="size-2 shrink-0 rounded-full"
					style={{ backgroundColor: toIssueLevel(String(filterOption.value)).color }}
				/>
			),
		})),
	}));
	const selectedFilters: SelectedFilter[] = filterGroups.flatMap((filterGroup) => {
		const value = query[filterGroup.name];

		if (value === undefined) {
			return [];
		}

		const selectedOption = filterGroup.options.find((filterOption) => filterOption.value === value);

		return [
			{
				name: filterGroup.name,
				groupLabel: filterGroup.label,
				// 입력한 숫자는 단위를 붙여 표시
				label: selectedOption?.label ?? `${value}${filterGroup.inputUnit ?? ''}`,
				icon: selectedOption?.icon,
				resetNames: filterGroup.resetNames,
			},
		];
	});

	return (
		// 필터 패널이 카드 밖으로 넘쳐도 다른 카드 위에 보이도록 표시
		<TitledCard
			title="이슈"
			action=<div className="flex items-center gap-2.5">
				<span className="text-[13px] text-muted-foreground">Sentry / {ISSUE_SORT_LABELS[sort]}</span>

				<FilterButton size="sm" filterCount={selectedFilters.length}>
					{/*프로젝트를 선택하기 전에는 릴리스 그룹을 숨김*/}
					<FilterPanel
						pathname="/analytics"
						query={query}
						filterGroups={filterGroups.filter(
							(filterGroup) => filterGroup.options.length > 0 || !!filterGroup.inputUnit,
						)}
						className="max-md:inset-x-4 max-md:top-[calc(100%+12px)] md:right-0 md:left-auto md:w-[min(560px,100cqw)]"
					/>
				</FilterButton>
			</div>
			className="relative z-1 min-w-0 overflow-visible"
		>
			{selectedFilters.length > 0 && (
				<div className="mb-3 flex flex-wrap gap-1.5">
					<SelectedFilters pathname="/analytics" query={query} selectedFilters={selectedFilters} />
				</div>
			)}

			{/*좁은 화면에서는 가로로 스크롤*/}
			<div className="overflow-x-auto">
				{/*이슈 열 및 프로젝트 열 사이의 빈 열은 카드가 넓어지면 함께 넓어짐*/}
				<div className="@container min-w-175 [--issue-gap:clamp(16px,calc((100cqw_-_735px)_*_0.3),120px)]">
					{/*열 이름을 누르면 그 기준으로 다시 조회*/}
					<div
						className={cn(
							rowClassName,
							'border-b pb-2 font-medium whitespace-nowrap text-muted-foreground',
						)}
					>
						<span>등급</span>
						이슈
						<span aria-hidden />
						<span>프로젝트</span>
						{HEAD_COLUMNS.map((headColumn) =>
							headColumn.sort ? (
								<Link
									key={headColumn.label}
									href={{
										pathname: '/analytics',
										query: toLinkQuery({
											...query,
											sort: headColumn.sort === 'date' ? undefined : headColumn.sort,
										}),
									}}
									scroll={false}
									aria-current={headColumn.sort === sort ? 'true' : undefined}
									className="group -mr-4 inline-flex items-center gap-0.5 justify-self-end rounded-sm hover:text-foreground aria-[current]:font-bold aria-[current]:text-foreground"
								>
									{headColumn.label}
									<ChevronDown
										className={cn(
											'size-3.5',
											headColumn.sort !== sort && 'opacity-0 group-hover:opacity-50',
										)}
									/>
								</Link>
							) : (
								<span key={headColumn.label} className="justify-self-end">
									{headColumn.label}
								</span>
							),
						)}
					</div>

					{issues.length === 0 && selectedFilters.length === 0 && (
						<p className="flex items-center gap-2 pt-3 text-muted-foreground">
							<Check className="size-4.5 text-success" />
							조회 기간에 발생한 이슈가 없습니다.
						</p>
					)}

					{issues.length === 0 && selectedFilters.length > 0 && (
						<p className="flex items-center gap-2 pt-3 text-muted-foreground">
							<ListFilter className="size-4.5" />
							조건에 맞는 이슈가 없습니다.
						</p>
					)}

					<ul className="divide-y tabular-nums">
						{issues.map((issue) => {
							const issueLevel = toIssueLevel(issue.level);
							const version = issue.release ? toReleaseVersion(issue.release) : '';

							return (
								<li key={issue.url} className={cn(rowClassName, 'py-2.5 last:pb-0')}>
									<span className="inline-flex items-center gap-1.5 text-[13px] leading-[21px] whitespace-nowrap text-muted-foreground">
										<span
											className="size-2 shrink-0 rounded-full"
											style={{ backgroundColor: issueLevel.color }}
										/>
										{issueLevel.label}
									</span>

									<div className="min-w-0">
										<p className="flex min-w-0 items-center gap-1.5">
											<strong title={issue.title} className="min-w-0 truncate font-semibold">
												{issue.title}
											</strong>
											{/*조회 기간에 처음 발생한 이슈*/}
											{formatDate(issue.first_seen) >= dateFrom && (
												<Badge variant="warning">새 이슈</Badge>
											)}
											{issue.is_unhandled && <Badge variant="destructive">미처리</Badge>}
											{issue.substatus === 'escalating' && (
												<Badge variant="destructive">급증</Badge>
											)}
											{issue.substatus === 'regressed' && <Badge variant="info">다시 발생</Badge>}
										</p>
										<p className="mt-0.5 flex min-w-0 gap-2 text-[12.5px] whitespace-nowrap text-muted-foreground">
											<span className="shrink-0 font-semibold">{issue.short_id}</span>
											{!!issue.culprit && (
												<span title={issue.culprit} className="min-w-0 truncate">
													{issue.culprit}
												</span>
											)}
										</p>
									</div>

									<span aria-hidden />

									<div className="min-w-0">
										<span
											title={issue.project}
											className="block truncate text-[13px] leading-[21px]"
										>
											{issue.project}
										</span>
										{!!version && (
											<span className="mt-0.5 block text-[12.5px] text-muted-foreground">
												{version}
											</span>
										)}
									</div>

									<div>
										<div className="grid grid-cols-[minmax(0,1fr)_52px] items-center gap-2.5 @max-[899px]:grid-cols-[52px]">
											<div aria-hidden className="h-2 rounded-full bg-muted @max-[899px]:hidden">
												<div
													className="h-full rounded-full"
													style={{
														width: `${(issue.count / maxCount) * 100}%`,
														backgroundColor: issueLevel.color,
													}}
												/>
											</div>
											<strong className="text-right font-bold">
												{issue.count.toLocaleString('ko-KR')}
											</strong>
										</div>
										<span className="mt-0.5 block text-right text-[12.5px] text-muted-foreground">
											{issue.user_count > 0
												? `${issue.user_count.toLocaleString('ko-KR')}명`
												: '-'}
										</span>
									</div>

									<time className="text-right whitespace-nowrap text-muted-foreground">
										{formatShortDate(issue.first_seen)}
									</time>
									<time className="text-right whitespace-nowrap text-muted-foreground">
										{formatRelativeTime(issue.last_seen, now)}
									</time>

									<a
										href={issue.url}
										target="_blank"
										rel="noopener"
										aria-label={`Sentry에서 ${issue.title} 열기`}
										title="Sentry에서 열기"
										className={cn(
											buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
											'-mt-1 text-muted-foreground',
										)}
									>
										<ExternalLink />
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</TitledCard>
	);
};

export default IssueCard;

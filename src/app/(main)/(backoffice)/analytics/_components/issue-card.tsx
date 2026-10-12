import Link from 'next/link';

import type { StabilityDashboard, StabilityIssueSort } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import { Check, ChevronDown, ExternalLink } from 'lucide-react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import SameWidthText from '@/app/(main)/(backoffice)/analytics/_components/same-width-text';
import { ISSUE_LEVELS, ISSUE_SORT_LABELS } from '@/config/analytics';
import { formatDate, formatRelativeTime, formatShortDate } from '@/utils/date';
import { toLinkQuery } from '@/utils/search-params';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

const SORT_COLUMNS = [
	{ sort: 'freq', label: '발생', className: '' },
	{ sort: 'user', label: '사용자', className: '@max-[620px]:hidden' },
	{ sort: 'date', label: '마지막 발생', className: '@max-[620px]:hidden' },
] satisfies { sort: StabilityIssueSort; label: string; className: string }[];

const rowClassName =
	'grid grid-cols-[minmax(0,1fr)_148px_60px_78px_28px] items-center gap-3.5 @max-[620px]:grid-cols-[minmax(0,1fr)_44px_28px]';

/** 이슈 등급의 이름 및 색을 찾는 함수 */
const toIssueLevel = (level: string) => {
	return ISSUE_LEVELS[level] ?? { label: level, color: 'var(--chart-neutral)' };
};

/** 처음 발생한 날짜 문구를 만드는 함수 */
const toFirstSeenText = (firstSeen: string) => {
	return `첫 발생 ${formatShortDate(firstSeen)}`;
};

interface Props {
	issues: StabilityDashboard['issues'];
	sort: StabilityIssueSort;
	dateFrom: string;
	query: Record<string, SearchParamValue>;
	now: number;
}

/**
 * Sentry 이슈 목록 카드 컴포넌트
 * @param issues 정렬 기준에 맞는 이슈 목록
 * @param sort 이슈 정렬 기준
 * @param dateFrom 조회 기간의 시작일
 * @param query 현재 주소의 쿼리
 * @param now 서버가 화면을 그린 시각
 */
const IssueCard = ({ issues, sort, dateFrom, query, now }: Props) => {
	const maxCount = Math.max(1, ...issues.map((issue) => issue.count));

	// 행마다 같은 자리에 오도록 열의 모든 값을 모음
	const levelLabels = issues.map((issue) => toIssueLevel(issue.level).label);
	const projects = issues.map((issue) => issue.project);
	const firstSeenTexts = issues.map((issue) => toFirstSeenText(issue.first_seen));

	return (
		<TitledCard
			title="이슈"
			action=<span className="text-[13px] text-muted-foreground">Sentry / {ISSUE_SORT_LABELS[sort]}</span>
		>
			<div className="@container">
				{/*열 이름을 누르면 그 기준으로 다시 조회*/}
				<div className={cn(rowClassName, 'border-b pb-2 font-medium whitespace-nowrap text-muted-foreground')}>
					이슈
					{SORT_COLUMNS.map((sortColumn) => (
						<Link
							key={sortColumn.sort}
							href={{
								pathname: '/analytics',
								query: toLinkQuery({
									...query,
									sort: sortColumn.sort === 'date' ? undefined : sortColumn.sort,
								}),
							}}
							scroll={false}
							aria-current={sortColumn.sort === sort ? 'true' : undefined}
							className={cn(
								'group -mr-4 inline-flex items-center gap-0.5 justify-self-end rounded-sm hover:text-foreground aria-[current]:font-bold aria-[current]:text-foreground',
								sortColumn.className,
							)}
						>
							{sortColumn.label}
							<ChevronDown
								className={cn(
									'size-3.5',
									sortColumn.sort !== sort && 'opacity-0 group-hover:opacity-50',
								)}
							/>
						</Link>
					))}
				</div>

				{issues.length === 0 && (
					<p className="flex items-center gap-2 pt-3 text-muted-foreground">
						<Check className="size-4.5 text-success" />
						조회 기간에 발생한 이슈가 없습니다.
					</p>
				)}

				<ul className="divide-y tabular-nums">
					{issues.map((issue) => {
						const issueLevel = toIssueLevel(issue.level);

						return (
							<li key={issue.url} className={cn(rowClassName, 'py-2.5 last:pb-0')}>
								<div className="min-w-0">
									<strong title={issue.title} className="block truncate font-semibold">
										{issue.title}
									</strong>
									<p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
										<span className="inline-flex items-center gap-1.5">
											<span
												className="size-2 shrink-0 rounded-full"
												style={{ backgroundColor: issueLevel.color }}
											/>
											<SameWidthText text={issueLevel.label} columnTexts={levelLabels} />
										</span>
										<SameWidthText text={issue.project} columnTexts={projects} />
										<SameWidthText
											text={toFirstSeenText(issue.first_seen)}
											columnTexts={firstSeenTexts}
										/>
										{/*조회 기간에 처음 발생한 이슈*/}
										{formatDate(issue.first_seen) >= dateFrom && (
											<Badge variant="warning">새 이슈</Badge>
										)}
									</p>
								</div>

								<div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2.5 @max-[620px]:grid-cols-[44px]">
									<div aria-hidden className="h-2 rounded-full bg-muted @max-[620px]:hidden">
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

								<span className="text-right font-semibold @max-[620px]:hidden">
									{issue.user_count > 0 ? `${issue.user_count.toLocaleString('ko-KR')}명` : '-'}
								</span>
								<time className="text-right whitespace-nowrap text-muted-foreground @max-[620px]:hidden">
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
										'text-muted-foreground',
									)}
								>
									<ExternalLink />
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</TitledCard>
	);
};

export default IssueCard;

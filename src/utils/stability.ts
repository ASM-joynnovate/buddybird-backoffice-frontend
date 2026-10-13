import {
	type StabilityDashboard,
	stabilityEnvironmentSchema,
	stabilityIssueLevelSchema,
	stabilityIssuePrioritySchema,
} from '@/types/apis/dashboard';

import type { FilterGroup } from '@/types/filter';

import { ISSUE_ENVIRONMENT_LABELS, ISSUE_LEVELS, ISSUE_PRIORITY_LABELS } from '@/config/analytics';

/** 이슈 등급의 이름 및 색을 찾는 함수 */
export const toIssueLevel = (level: string) => {
	return ISSUE_LEVELS[level] ?? { label: level, color: 'var(--chart-neutral)' };
};

/** 릴리스에서 @ 뒤의 버전을 꺼내는 함수 */
export const toReleaseVersion = (release: string) => {
	return release.slice(release.lastIndexOf('@') + 1);
};

/**
 * 이슈 필터 그룹을 만드는 함수
 * @param projects 프로젝트 목록
 * @param issueReleases 이슈가 발생한 릴리스 목록
 * @param project 선택한 프로젝트
 */
export const toIssueFilterGroups = (
	projects: StabilityDashboard['projects'],
	issueReleases: StabilityDashboard['issue_releases'],
	project?: string,
): FilterGroup[] => {
	return [
		{
			name: 'environment',
			label: '환경',
			options: stabilityEnvironmentSchema.options.map((environment) => ({
				value: environment,
				label: ISSUE_ENVIRONMENT_LABELS[environment],
			})),
		},
		{
			name: 'project',
			label: '프로젝트',
			options: projects.map((stabilityProject) => ({
				value: stabilityProject.project,
				label: stabilityProject.project,
			})),
			// 릴리스는 프로젝트에 딸린 값
			resetNames: ['release'],
		},
		{
			name: 'release',
			label: '릴리스',
			// 선택한 프로젝트의 릴리스만 나열
			options: issueReleases
				.filter((issueRelease) => issueRelease.project === project)
				.map(({ release }) => ({ value: release, label: toReleaseVersion(release) })),
		},
		{
			name: 'level',
			label: '등급',
			options: stabilityIssueLevelSchema.options.map((level) => ({
				value: level,
				label: toIssueLevel(level).label,
			})),
		},
		{
			name: 'priority',
			label: '우선순위',
			options: stabilityIssuePrioritySchema.options.map((priority) => ({
				value: priority,
				label: ISSUE_PRIORITY_LABELS[priority],
			})),
		},
		{
			name: 'is_new',
			label: '첫 발생',
			options: [
				{ value: true, label: '새 이슈' },
				{ value: false, label: '기존 이슈' },
			],
		},
		{
			name: 'is_unhandled',
			label: '예외',
			options: [
				{ value: true, label: '미처리' },
				{ value: false, label: '처리됨' },
			],
		},
		{
			name: 'is_regressed',
			label: '다시 발생',
			options: [
				{ value: true, label: '있음' },
				{ value: false, label: '없음' },
			],
		},
		{ name: 'min_user_count', label: '사용자', options: [], inputUnit: '명 이상' },
	];
};

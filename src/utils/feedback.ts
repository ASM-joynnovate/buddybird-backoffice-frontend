import { platformSchema } from '@/types/apis/app-updates';
import type { FeedbackDashboard } from '@/types/apis/dashboard';
import { feedbackLocaleSchema } from '@/types/apis/feedback';

import { FEEDBACK_FILTER_LABELS } from '@/config/feedback-filters';
import { toLocaleName } from '@/utils/locale';
import { toPlatformName } from '@/utils/platform';

/** 피드백 대시보드의 건수를 필터 그룹으로 변환하는 함수 */
export const toFeedbackFilterGroups = (feedbackDashboard: FeedbackDashboard) => {
	const { app_versions, platforms, locales } = feedbackDashboard;

	return [
		{
			name: 'app_version',
			label: FEEDBACK_FILTER_LABELS.app_version,
			// 높은 버전부터 나열
			options: app_versions
				.toSorted((a, b) => b.app_version.localeCompare(a.app_version, undefined, { numeric: true }))
				.map(({ app_version, count }) => ({ value: app_version, label: app_version, count })),
		},
		{
			name: 'platform',
			label: FEEDBACK_FILTER_LABELS.platform,
			options: platformSchema.options
				.flatMap((platform) => platforms.filter((platformCount) => platformCount.platform === platform))
				.map(({ platform, count }) => ({ value: platform, label: toPlatformName(platform), count })),
		},
		{
			name: 'locale',
			label: FEEDBACK_FILTER_LABELS.locale,
			options: feedbackLocaleSchema.options
				.flatMap((locale) => locales.filter((localeCount) => localeCount.locale === locale))
				.map(({ locale, count }) => ({ value: locale, label: toLocaleName(locale), count })),
		},
	];
};

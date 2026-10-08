import type { FeedbackDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CompositionGroup from '@/app/(main)/(backoffice)/_components/composition-group';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toFeedbackFilterGroups } from '@/utils/feedback';
import { toToggledQuery } from '@/utils/search-params';

const versionColorClassNames = [
	'bg-chart-2',
	'bg-chart-2/62',
	'bg-chart-2/30',
	'bg-chart-neutral',
	'bg-chart-neutral/45',
];
const colorClassNames: Record<string, string> = {
	ios: 'bg-chart-2',
	android: 'bg-chart-3',
	'ko-KR': 'bg-chart-1',
	'en-US': 'bg-chart-4',
};

interface Props {
	feedbackDashboard: FeedbackDashboard;
	query: Record<string, SearchParamValue>;
}

/**
 * 앱 버전, 기기, 언어의 구성 카드 컴포넌트
 * @param feedbackDashboard 피드백 대시보드 집계
 * @param query 현재 주소의 쿼리
 */
const CompositionCard = ({ feedbackDashboard, query }: Props) => {
	const feedbackCount = feedbackDashboard.feedback.count;

	const compositions = toFeedbackFilterGroups(feedbackDashboard).map((filterGroup) => ({
		name: filterGroup.name,
		title: filterGroup.label,
		parts: filterGroup.options.map(({ value, label, count }, index) => ({
			value,
			label,
			percent: Math.round((count / feedbackCount) * 100),
			// 앱 버전은 높은 버전부터 옅어지는 색
			colorClassName:
				colorClassNames[value] ?? versionColorClassNames[Math.min(index, versionColorClassNames.length - 1)],
			// 다른 값을 골랐으면 옅게 표시
			dimmed: !!query[filterGroup.name] && query[filterGroup.name] !== value,
			href: { pathname: '/feedback', query: toToggledQuery(query, filterGroup.name, value) },
		})),
	}));

	return (
		<TitledCard title="구성">
			{feedbackCount === 0 ? (
				<p className="text-muted-foreground">피드백이 없습니다.</p>
			) : (
				<div className="grid gap-4.5">
					{compositions.map((composition) => (
						<CompositionGroup key={composition.name} title={composition.title} parts={composition.parts} />
					))}
				</div>
			)}
		</TitledCard>
	);
};

export default CompositionCard;

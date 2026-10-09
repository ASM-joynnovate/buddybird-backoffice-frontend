'use client';

import Link from 'next/link';

import { useGetFeedbackList } from '@/hooks/apis/feedback';

import { formatDateTime } from '@/utils/date';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const VISIBLE_FEEDBACK_COUNT = 5;

/** 최근 피드백 표 컴포넌트 */
const RecentFeedbackTable = () => {
	const { data: feedbackListData } = useGetFeedbackList({ page: 1 });

	if (feedbackListData.data.length === 0) {
		return <p className="text-muted-foreground">피드백이 없습니다.</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="pl-0 text-muted-foreground">작성 일시</TableHead>
					<TableHead className="text-muted-foreground">내용</TableHead>
					<TableHead className="text-muted-foreground">앱 버전</TableHead>
					<TableHead className="text-muted-foreground">사용자</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{feedbackListData.data.slice(0, VISIBLE_FEEDBACK_COUNT).map((feedback) => (
					<TableRow key={feedback.id}>
						<TableCell className="py-2.5 pl-0 text-muted-foreground tabular-nums">
							{formatDateTime(feedback.created_at)}
						</TableCell>
						{/*남는 폭에 맞춰 한 줄로 자름*/}
						<TableCell className="w-full max-w-0 min-w-60 truncate py-2.5">{feedback.message}</TableCell>
						<TableCell className="py-2.5 text-muted-foreground tabular-nums">
							{feedback.app_version}
						</TableCell>
						<TableCell className="py-2.5">
							<Link href={`/users/${feedback.user_id}`} className="text-brand hover:underline">
								{feedback.user_id.slice(0, 8)}
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default RecentFeedbackTable;

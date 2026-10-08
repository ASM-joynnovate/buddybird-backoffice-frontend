'use client';

import { useGetFeedbackList } from '@/hooks/apis/feedback';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { USER_RECENT_ITEM_COUNT } from '@/config';
import { formatDateTime } from '@/utils/date';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	id: string;
}

/**
 * 사용자의 최근 피드백 카드 컴포넌트
 * @param id 조회할 사용자 ID
 */
const FeedbackCard = ({ id }: Props) => {
	const { data: feedbackListData } = useGetFeedbackList({
		page: 1,
		count_by_page: USER_RECENT_ITEM_COUNT,
		user_id: id,
	});

	return (
		<TitledCard title="피드백">
			{feedbackListData.data.length === 0 ? (
				<p className="text-muted-foreground">피드백이 없습니다.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="pl-0 text-muted-foreground">작성 일시</TableHead>
							<TableHead className="text-muted-foreground">내용</TableHead>
							<TableHead className="text-muted-foreground">앱 버전</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{feedbackListData.data.map((feedback) => (
							<TableRow key={feedback.id}>
								<TableCell className="py-2.5 pl-0 text-muted-foreground tabular-nums">
									{formatDateTime(feedback.created_at)}
								</TableCell>
								<TableCell className="min-w-50 py-2.5 whitespace-normal">{feedback.message}</TableCell>
								<TableCell className="py-2.5 text-muted-foreground tabular-nums">
									{feedback.app_version}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</TitledCard>
	);
};

export default FeedbackCard;

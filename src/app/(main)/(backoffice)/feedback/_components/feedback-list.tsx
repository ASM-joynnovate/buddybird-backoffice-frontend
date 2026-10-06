'use client';

import Link from 'next/link';

import { useGetFeedbackList } from '@/hooks/apis/feedback';

import { formatDateTime } from '@/utils/date';

import PageNavigation from '@/components/page-navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	page: number;
}

/**
 * 피드백 목록 컴포넌트
 * @param page 조회할 페이지 번호
 */
const FeedbackList = ({ page }: Props) => {
	const { data: feedbackListData } = useGetFeedbackList({ page });

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>작성 일시</TableHead>
						<TableHead>사용자</TableHead>
						<TableHead>기기 ID</TableHead>
						<TableHead>앱 버전</TableHead>
						<TableHead>내용</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{feedbackListData.data.map((feedback) => (
						<TableRow key={feedback.id}>
							<TableCell>{formatDateTime(feedback.created_at)}</TableCell>
							<TableCell>
								<Link href={`/users/${feedback.user_id}`}>{feedback.user_id}</Link>
							</TableCell>
							<TableCell>{feedback.device_id}</TableCell>
							<TableCell>{feedback.app_version}</TableCell>
							<TableCell>{feedback.message}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{feedbackListData.data.length === 0 && <p className="text-sm text-muted-foreground">피드백이 없습니다.</p>}

			<PageNavigation meta={feedbackListData.meta} pathname="/feedback" />
		</>
	);
};

export default FeedbackList;

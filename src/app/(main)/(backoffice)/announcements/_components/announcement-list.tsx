'use client';

import { useGetAnnouncementList } from '@/hooks/apis/announcements';

import AnnouncementRow from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';

import PageNavigation from '@/components/page-navigation';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	page: number;
}

/**
 * 공지 목록 컴포넌트
 * @param page 조회할 페이지 번호
 */
const AnnouncementList = ({ page }: Props) => {
	const { data: announcementListData } = useGetAnnouncementList({ page });

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>제목</TableHead>
						<TableHead>게시 시작</TableHead>
						<TableHead>게시 종료</TableHead>
						<TableHead>푸시 발송</TableHead>
						<TableHead>푸시 준비 일시</TableHead>
						<TableHead>사진 수</TableHead>
						<TableHead>관리</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{announcementListData.data.map((announcement) => (
						<AnnouncementRow key={announcement.id} announcement={announcement} />
					))}
				</TableBody>
			</Table>

			{announcementListData.data.length === 0 && (
				<p className="text-sm text-muted-foreground">공지가 없습니다.</p>
			)}

			<PageNavigation meta={announcementListData.meta} pathname="/announcements" />
		</>
	);
};

export default AnnouncementList;

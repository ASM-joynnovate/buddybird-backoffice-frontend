'use client';

import { useState } from 'react';

import type { AnnouncementListItem, AnnouncementListParams } from '@/types/apis/announcements';

import { useGetAnnouncementList } from '@/hooks/apis/announcements';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AnnouncementFormDialog from '@/app/(main)/(backoffice)/announcements/_components/announcement-form-dialog';
import AnnouncementRow, {
	announcementGridClassName,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import PageNavigation from '@/components/page-navigation';

interface Props {
	listParams: AnnouncementListParams;
}

/**
 * 종료된 공지 카드 컴포넌트
 * @param listParams 목록 조회 조건
 */
const EndedAnnouncementCard = ({ listParams }: Props) => {
	const { data: announcementListData } = useGetAnnouncementList(listParams);

	const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementListItem>();

	return (
		<>
			<TitledCard title="종료된 공지">
				{announcementListData.data.length === 0 ? (
					<p className="text-muted-foreground">종료된 공지가 없습니다.</p>
				) : (
					<>
						<div
							className={cn(
								announcementGridClassName,
								'font-medium whitespace-nowrap text-muted-foreground max-md:hidden',
							)}
						>
							<span className="pb-2">공지</span>
							<span className="pb-2 max-xl:hidden">본문</span>
							<span className="pb-2 text-right">읽음</span>
							<span className="pb-2">푸시</span>
						</div>

						<ul>
							{announcementListData.data.map((announcement) => (
								<AnnouncementRow
									key={announcement.id}
									announcement={announcement}
									userCount={announcementListData.meta.user_count}
									status="ended"
									onOpen={() => setEditingAnnouncement(announcement)}
								>
									<p className="line-clamp-2 pr-5 text-[13px] text-muted-foreground max-xl:hidden">
										{announcement.body ? koreanOrEnglishText(announcement.body) : '-'}
									</p>
								</AnnouncementRow>
							))}
						</ul>
					</>
				)}
			</TitledCard>

			{announcementListData.meta.total_page_count > 1 && (
				<PageNavigation meta={announcementListData.meta} pathname="/announcements" />
			)}

			{/*목록이 바뀌어도 저장이 끝날 때까지 유지*/}
			{!!editingAnnouncement && (
				<AnnouncementFormDialog
					announcement={editingAnnouncement}
					onClose={() => setEditingAnnouncement(undefined)}
				/>
			)}
		</>
	);
};

export default EndedAnnouncementCard;

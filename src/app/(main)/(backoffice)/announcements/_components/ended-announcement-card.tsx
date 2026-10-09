'use client';

import { useState } from 'react';

import type { AnnouncementListItem, AnnouncementListParams } from '@/types/apis/announcements';

import { useGetAnnouncementList } from '@/hooks/apis/announcements';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import SortLink from '@/app/(main)/(backoffice)/_components/sort-link';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AnnouncementFormDialog from '@/app/(main)/(backoffice)/announcements/_components/announcement-form-dialog';
import AnnouncementRow, {
	announcementGridClassName,
	announcementTableClassName,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import PageNavigation from '@/components/page-navigation';

interface Props {
	listParams: AnnouncementListParams;
	query: Record<string, SearchParamValue>;
}

/**
 * 종료된 공지 카드 컴포넌트
 * @param listParams 목록 조회 조건
 * @param query 현재 주소의 쿼리
 */
const EndedAnnouncementCard = ({ listParams, query }: Props) => {
	const { data: announcementListData } = useGetAnnouncementList(listParams);

	const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementListItem>();

	return (
		<>
			<TitledCard title="종료된 공지">
				{announcementListData.data.length === 0 ? (
					<p className="text-muted-foreground">종료된 공지가 없습니다.</p>
				) : (
					<div className="-mx-2 overflow-x-auto px-2">
						<div className={announcementTableClassName}>
							<div
								className={cn(
									announcementGridClassName,
									'font-medium whitespace-nowrap text-muted-foreground',
								)}
							>
								<span className="pb-2">
									<SortLink
										pathname="/announcements"
										query={query}
										sort="starts_at"
										defaultSort="starts_at"
									>
										공지
									</SortLink>
								</span>
								<span className="pb-2">본문</span>
								<span className="pb-2 text-right">
									<SortLink
										pathname="/announcements"
										query={query}
										sort="read_count"
										defaultSort="starts_at"
										// 값의 오른쪽 끝에 맞추게 아이콘을 앞에 배치
										className="flex-row-reverse"
									>
										읽음
									</SortLink>
								</span>
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
										<p className="line-clamp-2 pr-5 text-[13px] text-muted-foreground">
											{announcement.body ? koreanOrEnglishText(announcement.body) : '-'}
										</p>
									</AnnouncementRow>
								))}
							</ul>
						</div>
					</div>
				)}
			</TitledCard>

			{announcementListData.meta.total_page_count > 1 && (
				<PageNavigation meta={announcementListData.meta} pathname="/announcements" query={query} />
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

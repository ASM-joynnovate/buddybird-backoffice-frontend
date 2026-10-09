import type { Dashboard } from '@/types/apis/dashboard';

import dayjs from 'dayjs';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Badge } from '@/components/ui/badge';

interface Props {
	announcements: Dashboard['announcements'];
	userCount: number;
	now: number;
}

/**
 * 공지 카드 컴포넌트
 * @param announcements 끝나지 않은 공지 목록
 * @param userCount 전체 사용자 수
 * @param now 서버가 화면을 그린 시각
 */
const AnnouncementCard = ({ announcements, userCount, now }: Props) => {
	return (
		<TitledCard title="공지" href="/announcements" linkLabel="공지 관리">
			{announcements.length === 0 && (
				<p className="text-muted-foreground">게시 중이거나 예약된 공지가 없습니다.</p>
			)}

			<ul className="divide-y">
				{announcements.map((announcement) => (
					<li
						key={announcement.id}
						className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 py-2.5 first:pt-0 last:pb-0"
					>
						<p className="font-semibold">{koreanOrEnglishText(announcement.title)}</p>

						{dayjs(now).isBefore(announcement.starts_at) ? (
							<>
								<Badge variant="info">예약</Badge>
								<p className="col-span-2 text-[13px] text-muted-foreground">
									{formatDateTime(announcement.starts_at)} 시작
								</p>
							</>
						) : (
							<>
								<Badge variant="success">게시 중</Badge>
								<p className="col-span-2 text-[13px] text-muted-foreground">
									사용자의 {userCount ? Math.round((announcement.read_count / userCount) * 100) : 0}
									%가 읽음
								</p>
							</>
						)}
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default AnnouncementCard;

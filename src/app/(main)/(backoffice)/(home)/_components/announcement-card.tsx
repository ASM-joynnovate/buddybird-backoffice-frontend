import type { Dashboard } from '@/types/apis/dashboard';

import dayjs from 'dayjs';

import CountryFlagGroup from '@/app/(main)/(backoffice)/_components/country-flag-group';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Badge } from '@/components/ui/badge';

interface Props {
	announcements: Dashboard['announcements'];
	now: number;
}

/**
 * 공지 카드 컴포넌트
 * @param announcements 종료되지 않은 공지 목록
 * @param now 서버가 화면을 렌더링한 시각
 */
const AnnouncementCard = ({ announcements, now }: Props) => {
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
						<p className="flex items-center justify-between gap-3 font-semibold">
							{koreanOrEnglishText(announcement.title)}
							<CountryFlagGroup countries={announcement.countries} />
						</p>

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
									{announcement.user_count.toLocaleString('ko-KR')}명 중{' '}
									{announcement.user_count
										? Math.round((announcement.read_count / announcement.user_count) * 100)
										: 0}
									% 읽음
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

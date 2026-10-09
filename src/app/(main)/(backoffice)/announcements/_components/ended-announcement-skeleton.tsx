import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import SortLink from '@/app/(main)/(backoffice)/_components/sort-link';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import {
	announcementGridClassName,
	announcementTableClassName,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';

import { SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;
const PLACEHOLDER_TITLE_WIDTHS = ['62%', '48%', '70%'];

interface Props {
	query: Record<string, SearchParamValue>;
}

/**
 * 종료된 공지 카드를 불러오는 동안 보이는 컴포넌트
 * @param query 현재 주소의 쿼리
 */
const EndedAnnouncementSkeleton = ({ query }: Props) => {
	return (
		<TitledCard title="종료된 공지">
			<div className="-mx-2 overflow-x-auto px-2">
				<div className={announcementTableClassName}>
					<div
						className={cn(announcementGridClassName, 'font-medium whitespace-nowrap text-muted-foreground')}
					>
						<span className="pb-2">
							<SortLink pathname="/announcements" query={query} sort="starts_at" defaultSort="starts_at">
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
								className="flex-row-reverse"
							>
								읽음
							</SortLink>
						</span>
						<span className="pb-2">푸시</span>
					</div>

					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<div
							key={index}
							className={cn(
								announcementGridClassName,
								'relative before:absolute before:inset-x-0 before:top-0 before:border-t before:border-border',
							)}
						>
							{/*제목 줄 및 게시 기간 줄*/}
							<div className="py-2.5">
								<SkeletonText
									style={{
										width: PLACEHOLDER_TITLE_WIDTHS[index % PLACEHOLDER_TITLE_WIDTHS.length],
									}}
								/>
								<SkeletonText className="w-36 text-[13px]" />
							</div>
						</div>
					))}
				</div>
			</div>
		</TitledCard>
	);
};

export default EndedAnnouncementSkeleton;

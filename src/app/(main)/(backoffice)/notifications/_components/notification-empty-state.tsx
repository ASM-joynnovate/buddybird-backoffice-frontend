import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import SendNotificationButton from '@/app/(main)/(backoffice)/notifications/_components/send-notification-button';

interface Props {
	title: string;
	keyword?: string;
	filterSelected: boolean;
}

/**
 * 조건에 맞는 알림이 없을 때의 카드 컴포넌트
 * @param title 카드 제목
 * @param keyword 검색어
 * @param filterSelected 받는 사람, 종류, 날짜 조건을 골랐는지 여부
 */
const NotificationEmptyState = ({ title, keyword, filterSelected }: Props) => {
	return (
		<TitledCard title={title}>
			<div className="grid justify-items-center gap-2.5 px-4 pt-6.5 pb-4.5 text-center">
				{!!keyword && (
					<>
						<strong className="text-base font-bold">‘{keyword}’에 맞는 알림이 없습니다</strong>
						<p className="text-muted-foreground">검색어를 줄이거나 조회 기간을 늘려 보세요.</p>
					</>
				)}

				{!keyword && filterSelected && (
					<>
						<strong className="text-base font-bold">조건에 맞는 알림이 없습니다</strong>
						<p className="text-muted-foreground">위에서 고른 조건을 지우면 다른 알림이 보입니다.</p>
					</>
				)}

				{!keyword && !filterSelected && (
					<>
						<strong className="text-base font-bold">이 기간에 보낸 알림이 없습니다</strong>
						<p className="text-muted-foreground">
							공지, 긴급, 마케팅 알림을 보내면 받은 사람 및 읽은 비율이 여기에 표시됩니다.
						</p>

						<SendNotificationButton />
					</>
				)}
			</div>
		</TitledCard>
	);
};

export default NotificationEmptyState;

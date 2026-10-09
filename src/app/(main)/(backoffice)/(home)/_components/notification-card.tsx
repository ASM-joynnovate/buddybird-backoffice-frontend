'use client';

import type { Dashboard } from '@/types/apis/dashboard';

import HalfDonutChart from '@/app/(main)/(backoffice)/_components/half-donut-chart';
import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

const KIND_ORDER = Object.keys(NOTIFICATION_KINDS);

interface Props {
	notifications: Dashboard['notifications'];
}

/**
 * 알림 카드 컴포넌트
 * @param notifications 알림 집계 및 발송 목록
 */
const NotificationCard = ({ notifications }: Props) => {
	const sentCount = notifications.kinds.reduce((total, kindCount) => total + kindCount.sent_count, 0);
	const readCount = notifications.kinds.reduce((total, kindCount) => total + kindCount.read_count, 0);
	const kindCounts = notifications.kinds.toSorted((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));

	// 건수가 없는 목록은 제외
	const notificationSections = [
		{ title: '발송 예정', notifications: notifications.scheduled, readRateVisible: false },
		{ title: '최근 발송', notifications: notifications.recent, readRateVisible: true },
	].filter((notificationSection) => notificationSection.notifications.length > 0);

	return (
		<TitledCard title="알림" href="/notifications" linkLabel="발송 이력">
			{sentCount === 0 ? (
				<p className="text-muted-foreground">발송한 알림이 없습니다.</p>
			) : (
				<>
					{/*종류별 건수 반원 그래프 및 읽은 비율*/}
					<HalfDonutChart
						title="알림의 종류별 건수"
						parts={kindCounts.map((kindCount) => ({
							name: NOTIFICATION_KINDS[kindCount.kind].label,
							count: kindCount.sent_count,
							color: NOTIFICATION_KINDS[kindCount.kind].color,
						}))}
						value={`${Math.round((readCount / sentCount) * 100)}%`}
						label="읽음"
						unit="건"
					/>

					<ul className="mt-3.5 divide-y tabular-nums">
						{kindCounts.map((kindCount) => (
							<li key={kindCount.kind} className="flex items-center gap-2 py-1.5">
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: NOTIFICATION_KINDS[kindCount.kind].color }}
								/>
								{NOTIFICATION_KINDS[kindCount.kind].label}
								<strong className="ml-auto font-bold">
									{kindCount.sent_count.toLocaleString('ko-KR')}
								</strong>
								<span className="w-11 text-right text-muted-foreground">
									{Math.round((kindCount.sent_count / sentCount) * 100)}%
								</span>
							</li>
						))}

						<li className="flex items-center gap-2 py-1.5">
							전체
							<strong className="mr-13 ml-auto font-bold">{sentCount.toLocaleString('ko-KR')}</strong>
						</li>
					</ul>
				</>
			)}

			{notificationSections.map((notificationSection) => (
				<section key={notificationSection.title} className="mt-3.5 border-t pt-3">
					<h3 className="text-[12.5px] font-semibold text-muted-foreground">{notificationSection.title}</h3>

					<ul className="divide-y tabular-nums">
						{notificationSection.notifications.map((notification) => (
							<li
								key={`${notification.kind}:${notification.sent_at}:${notification.title.en_us}`}
								className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 py-2.5 last:pb-0"
							>
								<p className="font-semibold">{koreanOrEnglishText(notification.title)}</p>
								<strong className="font-bold">
									{notification.recipient_count.toLocaleString('ko-KR')}명
								</strong>

								<p className="col-span-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
									<span
										className="size-2 rounded-full"
										style={{ backgroundColor: NOTIFICATION_KINDS[notification.kind].color }}
									/>
									{NOTIFICATION_KINDS[notification.kind].label}
									<span className="ml-1">{formatDateTime(notification.sent_at)}</span>

									{notificationSection.readRateVisible && (
										<span className="ml-auto">
											{Math.round((notification.read_count / notification.recipient_count) * 100)}
											% 읽음
										</span>
									)}
								</p>
							</li>
						))}
					</ul>
				</section>
			))}
		</TitledCard>
	);
};

export default NotificationCard;

'use client';

import type { Settings } from '@/types/apis/settings';

import { useGetUser, useGetUserNotificationSettings } from '@/hooks/apis/users';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import NotificationSettingStateRow from '@/app/(main)/(backoffice)/users/[id]/_components/notification-setting-state-row';
import { koreanOrEnglishText } from '@/utils/i18n-text';

const HOURS_PER_DAY = 24;

/** 'HH:mm:ss' 시각을 하루 중 몇 %인지로 변환하는 함수 */
const toDayPercent = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number);

	return ((hours + minutes / 60) / HOURS_PER_DAY) * 100;
};

/** 수면 시간을 하루 막대의 구간으로 변환하는 함수 */
const toSleepBars = (sleep: Settings['sleep']) => {
	const sleepPercent = toDayPercent(sleep.sleep_at);
	const wakePercent = toDayPercent(sleep.wake_at);

	// 자정을 넘기는 수면 시간은 두 구간으로 표시
	return wakePercent > sleepPercent
		? [{ left: sleepPercent, width: wakePercent - sleepPercent }]
		: [
				{ left: 0, width: wakePercent },
				{ left: sleepPercent, width: 100 - sleepPercent },
			];
};

interface Props {
	id: string;
}

/**
 * 사용자의 수면 시간 및 알림 설정 카드 컴포넌트
 * @param id 조회할 사용자 ID
 */
const SettingsCard = ({ id }: Props) => {
	const { data: userData } = useGetUser({ id });
	const { data: userNotificationSettingsData } = useGetUserNotificationSettings({ id });

	const { settings } = userData;

	const sleepText = settings ? `${settings.sleep.sleep_at.slice(0, 5)} ~ ${settings.sleep.wake_at.slice(0, 5)}` : '-';

	return (
		<TitledCard title="설정">
			<div className="border-b pb-4">
				<p className="mb-2.5 flex justify-between gap-3">
					<span className="text-muted-foreground">수면 시간</span>
					<strong className="font-semibold tabular-nums">{sleepText}</strong>
				</p>

				{/*수면 시간이 없으면 막대 없이 "-"만 표시*/}
				{!!settings && (
					<>
						<div aria-hidden className="relative h-2 overflow-hidden rounded-full bg-muted">
							{toSleepBars(settings.sleep).map((sleepBar) => (
								<span
									key={sleepBar.left}
									className="absolute inset-y-0 bg-chart-4"
									style={{ left: `${sleepBar.left}%`, width: `${sleepBar.width}%` }}
								/>
							))}
						</div>

						<ol
							aria-hidden
							className="mt-1.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums"
						>
							<li>0시</li>
							<li>6시</li>
							<li>12시</li>
							<li>18시</li>
							<li>24시</li>
						</ol>
					</>
				)}
			</div>

			<section className="pt-3">
				<h3 className="mb-1 font-bold">알림</h3>

				<ul className="divide-y">
					<NotificationSettingStateRow
						label="전체 알림"
						enabled={userNotificationSettingsData.push_enabled}
					/>
					{userNotificationSettingsData.items.map((item) => (
						<NotificationSettingStateRow
							key={item.id}
							label={koreanOrEnglishText(item.title)}
							enabled={item.enabled}
							decidedAt={item.decided_at}
						/>
					))}
				</ul>

				{userNotificationSettingsData.groups.map((group) => (
					<div key={group.id} className="mt-2 border-t pt-3">
						<h4 className="text-[12.5px] font-semibold">{koreanOrEnglishText(group.title)}</h4>

						<ul className="divide-y">
							{group.items.map((item) => (
								<NotificationSettingStateRow
									key={item.id}
									label={koreanOrEnglishText(item.title)}
									enabled={item.enabled}
									decidedAt={item.decided_at}
								/>
							))}
						</ul>
					</div>
				))}
			</section>
		</TitledCard>
	);
};

export default SettingsCard;

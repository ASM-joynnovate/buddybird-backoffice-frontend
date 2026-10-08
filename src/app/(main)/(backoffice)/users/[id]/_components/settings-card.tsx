'use client';

import { useGetUser } from '@/hooks/apis/users';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

const HOURS_PER_DAY = 24;

/** 'HH:mm:ss' 시각을 하루 중 몇 %인지로 변환하는 함수 */
const toDayPercent = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number);

	return ((hours + minutes / 60) / HOURS_PER_DAY) * 100;
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

	const { settings } = userData;

	if (!settings) {
		return (
			<TitledCard title="설정">
				<p className="text-muted-foreground">설정이 없습니다.</p>
			</TitledCard>
		);
	}

	const sleepPercent = toDayPercent(settings.sleep.sleep_at);
	const wakePercent = toDayPercent(settings.sleep.wake_at);
	// 자정을 넘기는 수면 시간은 두 구간으로 표시
	const sleepBars =
		wakePercent > sleepPercent
			? [{ left: sleepPercent, width: wakePercent - sleepPercent }]
			: [
					{ left: 0, width: wakePercent },
					{ left: sleepPercent, width: 100 - sleepPercent },
				];
	const sleepText = `${settings.sleep.sleep_at.slice(0, 5)} ~ ${settings.sleep.wake_at.slice(0, 5)}`;

	const notificationSettings = [
		{ label: '푸시 알림', enabled: settings.notifications.push_enabled },
		{ label: '공지 알림', enabled: settings.notifications.announcement_enabled },
		{ label: '리포트 알림', enabled: settings.notifications.report_enabled },
		{ label: '마케팅 알림', enabled: settings.notifications.marketing_enabled },
		{ label: '야간 마케팅 알림', enabled: settings.notifications.marketing_night_enabled },
	];

	return (
		<TitledCard title="설정">
			<div className="mb-1 border-b pb-3">
				<p className="mb-2.5 flex justify-between gap-3">
					<span className="text-muted-foreground">수면 시간</span>
					<strong className="font-semibold tabular-nums">{sleepText}</strong>
				</p>

				<div aria-hidden className="relative h-2 overflow-hidden rounded-full bg-muted">
					{sleepBars.map((sleepBar) => (
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
			</div>

			<ul className="divide-y">
				{notificationSettings.map((notificationSetting) => (
					<li
						key={notificationSetting.label}
						className="flex items-center justify-between gap-3 py-2 last:pb-0"
					>
						<span className="text-muted-foreground">{notificationSetting.label}</span>
						<span className="sr-only">{notificationSetting.enabled ? '켬' : '끔'}</span>
						<span
							aria-hidden
							className={cn(
								'relative h-4 w-7 shrink-0 rounded-full bg-chart-neutral after:absolute after:top-0.5 after:left-0.5 after:size-3 after:rounded-full after:bg-card',
								notificationSetting.enabled && 'bg-foreground after:left-3.5',
							)}
						/>
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default SettingsCard;

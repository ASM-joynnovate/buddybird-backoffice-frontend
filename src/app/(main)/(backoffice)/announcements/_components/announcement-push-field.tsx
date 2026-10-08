'use client';

import type { Dispatch, SetStateAction } from 'react';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const PUSH_TIMINGS = [
	{ timeSpecified: false, label: '게시 시작 시' },
	{ timeSpecified: true, label: '시각 지정' },
];

export interface PushSetting {
	enabled: boolean;
	timeSpecified: boolean;
	localTime: string;
}

interface Props {
	pushSetting: PushSetting;
	onPushSettingChange: Dispatch<SetStateAction<PushSetting>>;
}

/**
 * 공지의 푸시 설정 입력 컴포넌트
 * @param pushSetting 푸시 설정 입력값
 * @param onPushSettingChange 입력값을 변경할 때 실행할 함수
 */
const AnnouncementPushField = ({ pushSetting, onPushSettingChange }: Props) => {
	return (
		<div className="flex min-h-9 flex-wrap items-center gap-2.5">
			<Switch
				aria-label="푸시 알림"
				checked={pushSetting.enabled}
				onCheckedChange={(enabled) => onPushSettingChange((prev) => ({ ...prev, enabled }))}
			/>

			{pushSetting.enabled && (
				<fieldset className="inline-flex h-9 w-fit min-w-0 rounded-md border bg-card p-0.5">
					<legend className="sr-only">푸시 시점</legend>

					{PUSH_TIMINGS.map(({ timeSpecified, label }) => (
						<label
							key={label}
							className="inline-flex cursor-pointer items-center rounded-sm px-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground has-checked:bg-foreground has-checked:text-card has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
						>
							<input
								type="radio"
								name="push-timing"
								checked={pushSetting.timeSpecified === timeSpecified}
								className="sr-only"
								onChange={() => onPushSettingChange((prev) => ({ ...prev, timeSpecified }))}
							/>
							{label}
						</label>
					))}
				</fieldset>
			)}

			{pushSetting.enabled && pushSetting.timeSpecified && (
				<>
					<Input
						type="time"
						aria-label="푸시 시각"
						required
						value={pushSetting.localTime}
						className="w-auto px-2 font-semibold tabular-nums"
						onChange={(event) => {
							const localTime = event.target.value;

							onPushSettingChange((prev) => ({ ...prev, localTime }));
						}}
					/>
					<span className="text-[13px] text-muted-foreground">수신자 현지 시각</span>
				</>
			)}
		</div>
	);
};

export default AnnouncementPushField;

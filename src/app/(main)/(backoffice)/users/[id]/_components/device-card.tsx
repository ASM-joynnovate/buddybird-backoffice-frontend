'use client';

import { useState } from 'react';

import type { Device } from '@/types/apis/devices';

import { useGetUser, useGetUserSessionList } from '@/hooks/apis/users';
import { useNow } from '@/hooks/use-now';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import PushDeliveryDialog from '@/app/(main)/(backoffice)/users/[id]/_components/push-delivery-dialog';
import { formatRelativeTime } from '@/utils/date';
import { toPlatformName } from '@/utils/platform';

import { Badge } from '@/components/ui/badge';

const infoClassName = 'flex min-w-0 justify-between gap-2';
const infoValueClassName = 'truncate font-semibold tabular-nums';

interface Props {
	id: string;
	initialNow: number;
}

/**
 * 기기 카드 컴포넌트
 * @param id 조회할 사용자 ID
 * @param initialNow 서버가 화면을 그린 시각
 */
const DeviceCard = ({ id, initialNow }: Props) => {
	const { data: userData } = useGetUser({ id });

	const { data: userSessionListData } = useGetUserSessionList({ id, page: 1 });

	const now = useNow(initialNow);

	const [pushDeliveryDevice, setPushDeliveryDevice] = useState<Device | null>(null);

	const [lastSession] = userSessionListData.data;
	const stationDeviceId = lastSession?.status === 'running' ? lastSession.station.device_id : undefined;

	return (
		<TitledCard
			title="기기"
			action={
				userData.devices.length > 0 && (
					<span className="text-[13px] text-muted-foreground">{userData.devices.length}대</span>
				)
			}
		>
			{userData.devices.length === 0 && <p className="text-muted-foreground">기기가 없습니다.</p>}

			<ul className="divide-y">
				{userData.devices.map((device) => (
					<li key={device.id} className="py-3 first:pt-0 last:pb-0">
						<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
							<strong className="font-semibold">{device.client.model}</strong>

							{device.id === stationDeviceId && (
								<Badge className="rounded-sm bg-info/10 font-bold text-info">스테이션</Badge>
							)}
							{device.is_deleted && (
								<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">로그아웃</Badge>
							)}
						</div>

						<dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] *:**:[dt]:whitespace-nowrap *:**:[dt]:text-muted-foreground">
							<div className={infoClassName}>
								<dt>OS</dt>
								<dd className={infoValueClassName}>
									{toPlatformName(device.client.platform)} {device.client.os_version}
								</dd>
							</div>
							<div className={infoClassName}>
								<dt>앱 버전</dt>
								<dd className={infoValueClassName}>{device.client.app_version}</dd>
							</div>
							<div className={infoClassName}>
								<dt>최근 접속</dt>
								<dd className={infoValueClassName}>
									{device.last_seen_at ? formatRelativeTime(device.last_seen_at, now) : '-'}
								</dd>
							</div>
							<div className={infoClassName}>
								<dt>푸시</dt>
								<dd className={infoValueClassName}>{device.push_registered ? '등록됨' : '없음'}</dd>
							</div>

							{!device.is_deleted && (
								<>
									<div className={infoClassName}>
										<dt>언어</dt>
										<dd className={infoValueClassName}>
											{device.locale === 'ko-KR' ? '한국어' : '영어'}
										</dd>
									</div>
									<div className={infoClassName}>
										<dt>시간대</dt>
										<dd className={infoValueClassName}>{device.timezone ?? '-'}</dd>
									</div>
								</>
							)}
						</dl>

						{!device.is_deleted && (
							<button
								type="button"
								className="mt-2 text-[13px] font-semibold text-brand hover:underline hover:underline-offset-3"
								onClick={() => setPushDeliveryDevice(device)}
							>
								푸시 발송 기록
							</button>
						)}
					</li>
				))}
			</ul>

			{!!pushDeliveryDevice && (
				<PushDeliveryDialog device={pushDeliveryDevice} onClose={() => setPushDeliveryDevice(null)} />
			)}
		</TitledCard>
	);
};

export default DeviceCard;

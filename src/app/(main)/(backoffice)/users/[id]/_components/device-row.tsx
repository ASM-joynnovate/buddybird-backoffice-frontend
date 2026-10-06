'use client';

import { useState } from 'react';

import type { Device } from '@/types/apis/devices';

import PushDeliveryDialog from '@/app/(main)/(backoffice)/users/[id]/_components/push-delivery-dialog';
import { formatDateTime } from '@/utils/date';
import { yesNoText } from '@/utils/yes-no';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
	device: Device;
}

/**
 * 기기 표의 행 컴포넌트
 * @param device 표시할 기기
 */
const DeviceRow = ({ device }: Props) => {
	const [pushDeliveryDialogOpen, setPushDeliveryDialogOpen] = useState(false);

	return (
		<TableRow>
			<TableCell>{device.id}</TableCell>
			<TableCell>{device.client.model}</TableCell>
			<TableCell>
				{device.client.platform} {device.client.os_version}
			</TableCell>
			<TableCell>{device.client.app_version}</TableCell>
			<TableCell>{device.locale}</TableCell>
			<TableCell>{device.timezone ?? '-'}</TableCell>
			<TableCell>{device.last_seen_at ? formatDateTime(device.last_seen_at) : '-'}</TableCell>
			<TableCell>{yesNoText(device.push_registered)}</TableCell>
			<TableCell>
				<Button variant="outline" onClick={() => setPushDeliveryDialogOpen(true)}>
					푸시 발송 기록
				</Button>

				{pushDeliveryDialogOpen && (
					<PushDeliveryDialog deviceId={device.id} onClose={() => setPushDeliveryDialogOpen(false)} />
				)}
			</TableCell>
		</TableRow>
	);
};

export default DeviceRow;

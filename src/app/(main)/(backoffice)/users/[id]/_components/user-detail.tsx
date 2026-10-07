'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useGetUser } from '@/hooks/apis/users';

import DeleteUserDialog from '@/app/(main)/(backoffice)/users/[id]/_components/delete-user-dialog';
import DeviceRow from '@/app/(main)/(backoffice)/users/[id]/_components/device-row';
import { formatDateTime } from '@/utils/date';
import { yesNoText } from '@/utils/yes-no';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	id: string;
}

/**
 * 사용자 상세 컴포넌트
 * @param id 조회할 사용자 ID
 */
const UserDetail = ({ id }: Props) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { data: userData } = useGetUser({ id });

	return (
		<>
			<section className="space-y-2">
				<div className="flex items-center justify-between">
					<h2>기본 정보</h2>

					{!userData.is_deleted && (
						<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
							사용자 삭제
						</Button>
					)}
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>이메일</TableHead>
							<TableHead>닉네임</TableHead>
							<TableHead>익명 여부</TableHead>
							<TableHead>삭제 여부</TableHead>
							<TableHead>가입 일시</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						<TableRow>
							<TableCell>{userData.id}</TableCell>
							<TableCell>{userData.email ?? '-'}</TableCell>
							<TableCell>{userData.nickname ?? '-'}</TableCell>
							<TableCell>{yesNoText(userData.is_anonymous)}</TableCell>
							<TableCell>{yesNoText(userData.is_deleted)}</TableCell>
							<TableCell>{formatDateTime(userData.created_at)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</section>

			<section className="space-y-2">
				<h2>프로필 사진</h2>

				{userData.photo_file ? (
					<div className="flex items-center gap-2">
						<Image src={userData.photo_file.url} alt="프로필 사진" width={96} height={96} unoptimized />
						<span>{userData.photo_file.status}</span>
					</div>
				) : (
					<p>-</p>
				)}
			</section>

			<section className="space-y-2">
				<h2>설정</h2>

				{userData.settings ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>취침 시각</TableHead>
								<TableHead>기상 시각</TableHead>
								<TableHead>푸시 알림</TableHead>
								<TableHead>공지 알림</TableHead>
								<TableHead>리포트 알림</TableHead>
								<TableHead>마케팅 알림</TableHead>
								<TableHead>야간 마케팅 알림</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							<TableRow>
								<TableCell>{userData.settings.sleep.sleep_at}</TableCell>
								<TableCell>{userData.settings.sleep.wake_at}</TableCell>
								<TableCell>{yesNoText(userData.settings.notifications.push_enabled)}</TableCell>
								<TableCell>{yesNoText(userData.settings.notifications.announcement_enabled)}</TableCell>
								<TableCell>{yesNoText(userData.settings.notifications.report_enabled)}</TableCell>
								<TableCell>{yesNoText(userData.settings.notifications.marketing_enabled)}</TableCell>
								<TableCell>
									{yesNoText(userData.settings.notifications.marketing_night_enabled)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				) : (
					<p>-</p>
				)}
			</section>

			<section className="space-y-2">
				<h2>탈퇴 상태</h2>

				{userData.withdrawal ? (
					<Table>
						<TableHeader>
							<TableRow>
								{userData.withdrawal.providers.map(({ provider }) => (
									<TableHead key={provider}>{provider}</TableHead>
								))}
								<TableHead>시도 횟수</TableHead>
								<TableHead>마지막 오류 코드</TableHead>
								<TableHead>다음 시도 일시</TableHead>
								<TableHead>완료 일시</TableHead>
								<TableHead>요청 일시</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							<TableRow>
								{userData.withdrawal.providers.map(({ provider, status }) => (
									<TableCell key={provider}>{status}</TableCell>
								))}
								<TableCell>{userData.withdrawal.attempt_count}</TableCell>
								<TableCell>{userData.withdrawal.last_error_code ?? '-'}</TableCell>
								<TableCell>
									{userData.withdrawal.next_attempt_at
										? formatDateTime(userData.withdrawal.next_attempt_at)
										: '-'}
								</TableCell>
								<TableCell>
									{userData.withdrawal.completed_at
										? formatDateTime(userData.withdrawal.completed_at)
										: '-'}
								</TableCell>
								<TableCell>{formatDateTime(userData.withdrawal.created_at)}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				) : (
					<p>-</p>
				)}
			</section>

			<section className="space-y-2">
				<h2>기기</h2>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>모델</TableHead>
							<TableHead>OS</TableHead>
							<TableHead>앱 버전</TableHead>
							<TableHead>언어</TableHead>
							<TableHead>시간대</TableHead>
							<TableHead>마지막 접속 일시</TableHead>
							<TableHead>푸시 등록 여부</TableHead>
							<TableHead>관리</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{userData.devices.map((device) => (
							<DeviceRow key={device.id} device={device} />
						))}
					</TableBody>
				</Table>

				{userData.devices.length === 0 && <p className="text-sm text-muted-foreground">기기가 없습니다.</p>}
			</section>

			<DeleteUserDialog open={deleteDialogOpen} id={id} onClose={() => setDeleteDialogOpen(false)} />
		</>
	);
};

export default UserDetail;

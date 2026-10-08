'use client';

import { useState } from 'react';

import { useGetUser } from '@/hooks/apis/users';
import { useNow } from '@/hooks/use-now';

import dayjs from 'dayjs';
import { Bell, Copy, Trash2, TriangleAlert } from 'lucide-react';

import ProviderIcon, { PROVIDER_LABELS } from '@/app/(main)/(backoffice)/_components/provider-icon';
import SendNotificationDialog from '@/app/(main)/(backoffice)/_components/send-notification-dialog';
import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import DeleteUserDialog from '@/app/(main)/(backoffice)/users/[id]/_components/delete-user-dialog';
import { formatDateTime, formatRelativeTime } from '@/utils/date';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const factClassName = 'min-w-0 rounded-lg bg-muted px-3.5 py-2.5';
const factValueClassName = 'text-base font-bold tracking-tight tabular-nums';
const factNoteClassName = 'text-[12.5px] text-muted-foreground';

interface Props {
	id: string;
	initialNow: number;
}

/**
 * 사용자 프로필 카드 컴포넌트
 * @param id 조회할 사용자 ID
 * @param initialNow 서버가 화면을 그린 시각
 */
const UserProfileCard = ({ id, initialNow }: Props) => {
	const { data: userData } = useGetUser({ id });

	const now = useNow(initialNow);

	const [sendDialogOpen, setSendDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [idCopied, setIdCopied] = useState(false);

	const { withdrawal } = userData;
	const lastSeenDevice = userData.devices
		.filter((device) => device.last_seen_at)
		.toSorted((a, b) => dayjs(b.last_seen_at).valueOf() - dayjs(a.last_seen_at).valueOf())[0];

	const handleCopyId = () => {
		void navigator.clipboard.writeText(userData.id);

		setIdCopied(true);
	};

	return (
		<>
			<Card className="gap-4 px-5 py-4.5">
				<header className="flex flex-wrap items-center gap-3.5">
					<UserAvatar
						photoUrl={userData.photo_file?.url}
						nickname={userData.nickname}
						className="size-14 text-[22px]"
					/>

					<div>
						<h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold">
							{userData.nickname ?? '닉네임 없음'}
							{userData.is_anonymous && (
								<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">익명</Badge>
							)}
							{userData.is_deleted && (
								<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">삭제됨</Badge>
							)}
						</h1>
						{!!userData.email && <p className="text-muted-foreground">{userData.email}</p>}
					</div>

					{!userData.is_deleted && (
						<div className="flex gap-2 max-md:w-full max-md:*:flex-1 md:ml-auto">
							<Button variant="outline" onClick={() => setSendDialogOpen(true)}>
								<Bell />
								알림 보내기
							</Button>
							<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
								<Trash2 />
								사용자 삭제
							</Button>
						</div>
					)}
				</header>

				<dl className="grid grid-cols-2 gap-2 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
					<div className={`${factClassName} relative max-md:col-span-2`}>
						<dt className={factNoteClassName}>사용자 ID</dt>
						<dd className={`${factValueClassName} wrap-anywhere`}>{userData.id}</dd>
						<dd className={factNoteClassName}>Sentry 및 피드백에 표시되는 값</dd>

						<button
							type="button"
							aria-label={idCopied ? '사용자 ID 복사됨' : '사용자 ID 복사'}
							className="absolute top-2 right-2 grid size-6 place-items-center rounded-sm text-muted-foreground hover:bg-card hover:text-foreground"
							onClick={handleCopyId}
						>
							<Copy className="size-4" />
						</button>
					</div>

					<div className={factClassName}>
						<dt className={factNoteClassName}>로그인</dt>
						<dd className={`${factValueClassName} flex flex-wrap gap-1.5 py-0.5`}>
							{userData.is_anonymous && '익명'}
							{!userData.is_anonymous && userData.providers.length === 0 && '-'}
							{userData.providers.map((provider) => (
								<span
									key={provider}
									className="inline-flex items-center gap-1.5 rounded-full bg-card py-0.5 pr-2.5 pl-0.5 text-[13px] font-semibold tracking-normal ring-1 ring-border"
								>
									<ProviderIcon provider={provider} />
									{PROVIDER_LABELS[provider]}
								</span>
							))}
						</dd>
						<dd className={factNoteClassName}>
							{userData.providers.length > 0
								? `소셜 계정 ${userData.providers.length}개 연결`
								: '계정 연결 전'}
						</dd>
					</div>

					<div className={factClassName}>
						<dt className={factNoteClassName}>가입</dt>
						<dd className={factValueClassName}>{formatRelativeTime(userData.created_at, now)}</dd>
						<dd className={factNoteClassName}>{formatDateTime(userData.created_at)}</dd>
					</div>

					<div className={factClassName}>
						<dt className={factNoteClassName}>최근 접속</dt>
						<dd className={factValueClassName}>
							{lastSeenDevice?.last_seen_at ? formatRelativeTime(lastSeenDevice.last_seen_at, now) : '-'}
						</dd>
						<dd className={factNoteClassName}>{lastSeenDevice?.client.model}</dd>
					</div>
				</dl>
			</Card>

			{/*탈퇴 처리가 실패한 사용자의 안내*/}
			{!!withdrawal && !withdrawal.completed_at && !!withdrawal.last_error_code && (
				<p className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-[13px]">
					<TriangleAlert className="size-4 shrink-0 text-warning" />
					탈퇴 처리가 {withdrawal.attempt_count}번 실패했습니다
					{!!withdrawal.next_attempt_at && (
						<strong className="ml-auto font-bold whitespace-nowrap tabular-nums">
							다음 시도 {formatDateTime(withdrawal.next_attempt_at)}
						</strong>
					)}
				</p>
			)}

			{sendDialogOpen && (
				<SendNotificationDialog initialUserId={userData.id} onClose={() => setSendDialogOpen(false)} />
			)}

			<DeleteUserDialog open={deleteDialogOpen} id={id} onClose={() => setDeleteDialogOpen(false)} />
		</>
	);
};

export default UserProfileCard;

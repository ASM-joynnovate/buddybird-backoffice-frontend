'use client';

import { ViewTransition } from 'react';

import Link from 'next/link';

import type { UserListParams } from '@/types/apis/users';

import { useGetUserList } from '@/hooks/apis/users';
import { useNow } from '@/hooks/use-now';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import { TriangleAlert } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import SortLink from '@/app/(main)/(backoffice)/_components/sort-link';
import UserSummary from '@/app/(main)/(backoffice)/_components/user-summary';
import ParrotPhoto from '@/app/(main)/(backoffice)/users/_components/parrot-photo';
import { SESSION_PHASES } from '@/config/session';
import { DAY, HOUR } from '@/config/units';
import { formatDate, formatRelativeTime } from '@/utils/date';
import { toPlatformName } from '@/utils/platform';
import { toLinkQuery } from '@/utils/search-params';
import { toSpeciesName } from '@/utils/species';

import PageNavigation from '@/components/page-navigation';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const sortColumns = {
	parrot_count: { label: '앵무새' },
	status: { label: '상태' },
	recent_duration: { label: '최근 14일 세션' },
	session_count: { label: '세션' },
	app_version: { label: '기기' },
	created_at: { label: '가입일' },
};

interface Props {
	listParams: UserListParams;
	query: Record<string, SearchParamValue>;
	initialNow: number;
}

/**
 * 사용자 표 컴포넌트
 * @param listParams 목록 조회 조건
 * @param query 현재 주소의 쿼리
 * @param initialNow 서버가 화면을 그린 시각
 */
const UserTable = ({ listParams, query, initialNow }: Props) => {
	const { data: userListData } = useGetUserList(listParams);

	const now = useNow(initialNow);

	/** 정렬할 수 있는 열의 제목 */
	const sortColumnHead = (sort: keyof typeof sortColumns) => (
		<TableHead className="text-muted-foreground">
			<SortLink pathname="/users" query={query} sort={sort} defaultSort="created_at">
				{sortColumns[sort].label}
			</SortLink>
		</TableHead>
	);

	if (userListData.data.length === 0) {
		return (
			<Card className="grid justify-items-center gap-2.5 px-4 pt-11 pb-9 text-center">
				<strong className="text-base font-bold">
					{listParams.keyword
						? `‘${listParams.keyword}’에 맞는 사용자가 없습니다`
						: '조건에 맞는 사용자가 없습니다'}
				</strong>
				<p className="text-muted-foreground">
					{listParams.keyword
						? '닉네임, 이메일, 사용자 ID를 다시 확인해 주세요.'
						: '위에서 고른 조건을 지우면 다른 사용자가 보입니다.'}
				</p>

				{!!listParams.keyword && !listParams.is_deleted && (
					<Link
						href={{ pathname: '/users', query: toLinkQuery({ ...query, is_deleted: true }) }}
						scroll={false}
						className={buttonVariants({ variant: 'outline' })}
					>
						삭제된 사용자에서 찾기
					</Link>
				)}
			</Card>
		);
	}

	return (
		<>
			<Card className="gap-0 px-2 pt-1 pb-2 md:px-3 md:pt-2 md:pb-3">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="text-muted-foreground">사용자</TableHead>
							{sortColumnHead('parrot_count')}
							{sortColumnHead('status')}
							{sortColumnHead('recent_duration')}
							{sortColumnHead('session_count')}
							{sortColumnHead('app_version')}
							{sortColumnHead('created_at')}
						</TableRow>
					</TableHeader>

					<TableBody>
						{userListData.data.map((user) => {
							const recentDurationMs = user.daily_durations.reduce(
								(total, dailyDuration) => total + dailyDuration.duration_ms,
								0,
							);
							return (
								<ViewTransition key={user.id} name={`user-${user.id}`}>
									<TableRow className="group relative hover:bg-muted [&>td]:py-2.5 [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md">
										<TableCell>
											{/*행 전체가 상세 화면 링크*/}
											<Link
												href={`/users/${user.id}`}
												className={cn(
													'flex min-w-0 items-center gap-2.5 after:absolute after:inset-0 max-sm:max-w-45',
													user.is_deleted && 'opacity-55',
												)}
											>
												<UserSummary user={user} />
											</Link>
										</TableCell>

										<TableCell>
											{user.first_parrot ? (
												<div
													className={cn(
														'flex items-center gap-2.5',
														user.is_deleted && 'opacity-55',
													)}
												>
													<ParrotPhoto
														photoUrl={user.first_parrot.photo_file?.url}
														name={user.first_parrot.name}
													/>

													<div className="min-w-0">
														<strong className="block font-semibold">
															{user.first_parrot.name}
															{user.parrot_count > 1 && (
																<span className="ml-1.5 text-[12.5px] font-normal text-muted-foreground">
																	외 {user.parrot_count - 1}마리
																</span>
															)}
														</strong>
														<span className="block text-[13px] text-muted-foreground max-md:hidden">
															{toSpeciesName(user.first_parrot.species)}
														</span>
													</div>
												</div>
											) : (
												<span className="text-muted-foreground">등록 전</span>
											)}
										</TableCell>

										<TableCell>
											{user.is_deleted && <Badge variant="muted">삭제됨</Badge>}

											{!user.is_deleted && !!user.running_session && (
												<ColorTag
													color={
														user.running_session.current_phase
															? SESSION_PHASES[user.running_session.current_phase].color
															: 'var(--success)'
													}
												>
													{user.running_session.current_phase
														? SESSION_PHASES[user.running_session.current_phase].label
														: '실행 중'}
												</ColorTag>
											)}

											{!user.is_deleted && !user.running_session && (
												<span className="text-muted-foreground tabular-nums">
													{user.last_seen_device?.last_seen_at
														? formatRelativeTime(user.last_seen_device.last_seen_at, now)
														: '-'}
												</span>
											)}
										</TableCell>

										<TableCell>
											<div className="flex items-center gap-3">
												<span aria-hidden className="flex h-7 shrink-0 items-end gap-0.5">
													{user.daily_durations.map((dailyDuration, index) => (
														<span
															key={dailyDuration.date}
															className="relative h-full w-1 overflow-hidden rounded-full bg-muted group-hover:bg-card"
														>
															<span
																className={cn(
																	'absolute inset-x-0 bottom-0 rounded-full bg-chart-1/42',
																	index === user.daily_durations.length - 1 &&
																		'bg-chart-1',
																)}
																style={{
																	height: `${(dailyDuration.duration_ms / DAY) * 100}%`,
																}}
															/>
														</span>
													))}
												</span>

												<strong
													className={cn(
														'font-semibold tabular-nums',
														recentDurationMs === 0 && 'text-muted-foreground',
													)}
												>
													{Math.round(recentDurationMs / HOUR)}시간
												</strong>
											</div>
										</TableCell>

										<TableCell className="tabular-nums">{user.session_count}회</TableCell>

										<TableCell className="tabular-nums">
											{user.last_seen_device ? (
												<span className="inline-flex items-center gap-1.5">
													<PlatformIcon platform={user.last_seen_device.platform} />
													<span className="text-muted-foreground">
														{toPlatformName(user.last_seen_device.platform)}
													</span>

													{user.last_seen_device.is_unsupported ? (
														<span
															title="최소 지원 버전보다 낮음"
															className="inline-flex items-center gap-1 font-semibold text-warning"
														>
															<TriangleAlert className="size-3.5" />
															{user.last_seen_device.app_version}
														</span>
													) : (
														user.last_seen_device.app_version
													)}

													{user.device_count > 1 && (
														<span className="ml-0.5 text-[12.5px] text-muted-foreground">
															외 {user.device_count - 1}대
														</span>
													)}
												</span>
											) : (
												'-'
											)}
										</TableCell>

										<TableCell className="text-muted-foreground tabular-nums">
											{formatDate(user.created_at)}
										</TableCell>
									</TableRow>
								</ViewTransition>
							);
						})}
					</TableBody>
				</Table>
			</Card>

			<PageNavigation meta={userListData.meta} pathname="/users" query={query} />
		</>
	);
};

export default UserTable;

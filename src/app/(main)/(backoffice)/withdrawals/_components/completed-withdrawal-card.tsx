'use client';

import { ViewTransition } from 'react';

import Link from 'next/link';

import type { WithdrawalListParams } from '@/types/apis/withdrawals';

import { useGetWithdrawalList } from '@/hooks/apis/withdrawals';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { TriangleAlert } from 'lucide-react';

import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import SortLink from '@/app/(main)/(backoffice)/_components/sort-link';
import StepChip from '@/app/(main)/(backoffice)/_components/step-chip';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import UserSummary from '@/app/(main)/(backoffice)/_components/user-summary';
import { countDays, formatDate, formatDuration, formatShortDate, formatShortDateTime } from '@/utils/date';
import { toPlatformName } from '@/utils/platform';

import PageNavigation from '@/components/page-navigation';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	listParams: WithdrawalListParams;
	query: Record<string, SearchParamValue>;
}

/**
 * 완료된 탈퇴 카드 컴포넌트
 * @param listParams 목록 조회 조건
 * @param query 현재 주소의 쿼리
 */
const CompletedWithdrawalCard = ({ listParams, query }: Props) => {
	const { data: withdrawalListData } = useGetWithdrawalList(listParams);

	if (withdrawalListData.data.length === 0) {
		return (
			<TitledCard title="완료">
				<div className="grid justify-items-center gap-2.5 px-4 pt-6.5 pb-4.5 text-center">
					<strong className="text-base font-bold">이 기간에 완료된 탈퇴가 없습니다</strong>
					<p className="text-muted-foreground">조회 기간을 늘리면 이전 탈퇴가 보입니다.</p>

					<Link
						href={{ pathname: '/withdrawals', query: { period: 90 } }}
						scroll={false}
						className={cn(buttonVariants({ variant: 'outline' }))}
					>
						최근 90일 보기
					</Link>
				</div>
			</TitledCard>
		);
	}

	return (
		<>
			<TitledCard title="완료">
				<div className="-mx-2 -mt-2">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="text-muted-foreground">사용자</TableHead>
								<TableHead className="text-muted-foreground">계정</TableHead>
								<TableHead className="pr-6 text-muted-foreground">
									<SortLink
										pathname="/withdrawals"
										query={query}
										sort="usage_period"
										defaultSort="created_at"
									>
										사용 기간
									</SortLink>
								</TableHead>
								<TableHead className="pr-6 text-muted-foreground">
									<SortLink
										pathname="/withdrawals"
										query={query}
										sort="session_count"
										defaultSort="created_at"
									>
										세션
									</SortLink>
								</TableHead>
								<TableHead className="text-muted-foreground">기기</TableHead>
								<TableHead className="text-muted-foreground">피드백</TableHead>
								<TableHead className="text-right text-muted-foreground">
									<SortLink
										pathname="/withdrawals"
										query={query}
										sort="created_at"
										defaultSort="created_at"
										// 값의 오른쪽 끝에 맞추게 아이콘을 앞에 배치
										className="flex-row-reverse"
									>
										요청
									</SortLink>
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{withdrawalListData.data.map((withdrawal) => {
								const { user } = withdrawal;

								const providerSteps = withdrawal.steps.filter(({ step }) => step !== 'account');
								// 가입한 날 탈퇴하면 0일
								const usageDayCount =
									countDays(formatDate(user.created_at), formatDate(withdrawal.created_at)) - 1;

								return (
									<ViewTransition
										key={withdrawal.user_id}
										name={`completed-withdrawal-${withdrawal.user_id}`}
									>
										<TableRow className="group relative hover:bg-muted [&>td]:py-2.5 [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md">
											<TableCell>
												{/*행 전체가 상세 화면 링크*/}
												<Link
													href={`/users/${withdrawal.user_id}`}
													className="flex max-w-60 min-w-0 items-center gap-2.5 after:absolute after:inset-0 max-md:max-w-50"
												>
													<UserSummary user={user} />
												</Link>
											</TableCell>

											<TableCell>
												{providerSteps.length > 0 ? (
													<div className="flex gap-1.5">
														{providerSteps.map(({ step, status }) => (
															<StepChip
																key={step}
																step={step}
																status={status === 'unconfirmed' ? status : undefined}
															/>
														))}
													</div>
												) : (
													<span className="text-muted-foreground">없음</span>
												)}
											</TableCell>

											<TableCell className="pr-6 tabular-nums">
												<strong className="block font-semibold">{usageDayCount}일</strong>
												<small className="block text-[12.5px] text-muted-foreground">
													가입 {formatShortDate(user.created_at)}
												</small>
											</TableCell>

											<TableCell className="pr-6 tabular-nums">
												{user.session_count > 0 ? (
													<>
														<strong className="block font-semibold">
															{user.session_count}회
														</strong>

														{!!user.last_session_started_at && (
															<small className="block text-[12.5px] text-muted-foreground">
																마지막{' '}
																{formatShortDateTime(user.last_session_started_at)}
															</small>
														)}
													</>
												) : (
													<span className="text-muted-foreground">0회</span>
												)}
											</TableCell>

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
															<span className="text-[12.5px] text-muted-foreground">
																외 {user.device_count - 1}대
															</span>
														)}
													</span>
												) : (
													'-'
												)}
											</TableCell>

											<TableCell className="tabular-nums">
												{user.feedback_count > 0 ? (
													<>
														<strong className="block font-semibold">
															{user.feedback_count}건
														</strong>
														<small className="block max-w-65 truncate text-[12.5px] text-muted-foreground max-xl:max-w-40">
															{user.last_feedback_message}
														</small>
													</>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</TableCell>

											<TableCell className="text-right text-muted-foreground tabular-nums">
												<time dateTime={withdrawal.created_at}>
													{formatShortDateTime(withdrawal.created_at)}
												</time>

												{!!withdrawal.completed_at && (
													<small
														title={
															withdrawal.attempt_count > 0
																? `실패 ${withdrawal.attempt_count}회`
																: undefined
														}
														// title이 행 링크에 가려지지 않게 배치
														className={cn(
															'block text-[12.5px]',
															withdrawal.attempt_count > 0 && 'relative',
														)}
													>
														처리{' '}
														{formatDuration(
															dayjs(withdrawal.completed_at).diff(withdrawal.created_at),
														)}
													</small>
												)}
											</TableCell>
										</TableRow>
									</ViewTransition>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</TitledCard>

			{withdrawalListData.meta.total_page_count > 1 && (
				<PageNavigation meta={withdrawalListData.meta} pathname="/withdrawals" query={query} />
			)}
		</>
	);
};

export default CompletedWithdrawalCard;

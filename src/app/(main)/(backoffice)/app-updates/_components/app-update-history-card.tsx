'use client';

import { useState } from 'react';

import type { AppUpdate, Platform } from '@/types/apis/app-updates';

import { useGetAppUpdateList } from '@/hooks/apis/app-updates';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AddAppUpdateButton from '@/app/(main)/(backoffice)/app-updates/_components/add-app-update-button';
import AppUpdateFormDialog from '@/app/(main)/(backoffice)/app-updates/_components/app-update-form-dialog';
import AppUpdateRow, { appUpdateGridClassName } from '@/app/(main)/(backoffice)/app-updates/_components/app-update-row';

interface Props {
	platform: Platform;
	now: number;
}

/**
 * 등록된 업데이트를 나열한 "업데이트 내역" 카드 컴포넌트
 * @param platform 선택된 플랫폼
 * @param now 서버가 화면을 그린 시각
 */
const AppUpdateHistoryCard = ({ platform, now }: Props) => {
	const { data: appUpdateListData } = useGetAppUpdateList({ platform });

	const [editingAppUpdate, setEditingAppUpdate] = useState<AppUpdate>();

	return (
		<>
			<TitledCard
				title="업데이트 내역"
				action={
					appUpdateListData.length > 0 && (
						<span className="text-[13px] text-muted-foreground tabular-nums">
							{appUpdateListData.length}건
						</span>
					)
				}
			>
				{appUpdateListData.length === 0 ? (
					<div className="grid justify-items-center gap-1.5 px-4 pt-7 pb-3.5 text-center">
						<strong className="text-base font-bold">등록된 업데이트가 없습니다</strong>
						<p className="text-muted-foreground">
							업데이트를 추가하기 전까지 앱에 업데이트 안내가 표시되지 않습니다.
						</p>

						<div className="mt-2.5">
							<AddAppUpdateButton platform={platform} />
						</div>
					</div>
				) : (
					<>
						<div
							className={cn(
								appUpdateGridClassName,
								'font-medium whitespace-nowrap text-muted-foreground max-md:hidden',
							)}
						>
							<span className="pb-2">버전</span>
							<span className="pb-2">출시 노트</span>
							<span className="pb-2">강제</span>
							<span className="pb-2">등록 일시</span>
						</div>

						<ul>
							{appUpdateListData.map((appUpdate) => (
								<AppUpdateRow
									key={appUpdate.id}
									appUpdate={appUpdate}
									now={now}
									onOpen={() => setEditingAppUpdate(appUpdate)}
								/>
							))}
						</ul>
					</>
				)}
			</TitledCard>

			{/*목록이 바뀌어도 저장이 끝날 때까지 유지*/}
			{!!editingAppUpdate && (
				<AppUpdateFormDialog
					platform={platform}
					appUpdate={editingAppUpdate}
					onClose={() => setEditingAppUpdate(undefined)}
				/>
			)}
		</>
	);
};

export default AppUpdateHistoryCard;

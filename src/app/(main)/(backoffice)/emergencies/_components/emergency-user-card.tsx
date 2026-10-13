import Link from 'next/link';

import type { EmergencyDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import { toToggledQuery } from '@/utils/search-params';

interface Props {
	users: EmergencyDashboard['users'];
	query: Record<string, SearchParamValue>;
}

/**
 * 응급 상황이 많은 사용자 카드 컴포넌트
 * @param users 응급 상황이 많은 순서의 사용자 목록
 * @param query 현재 주소의 쿼리
 */
const EmergencyUserCard = ({ users, query }: Props) => {
	const maxUserCount = Math.max(1, ...users.map((user) => user.sound_count + user.vision_count));

	return (
		<TitledCard
			title="사용자"
			action={
				users.length > 0 && <span className="text-[13px] text-muted-foreground">상위 {users.length}명</span>
			}
		>
			{users.length === 0 && <p className="text-muted-foreground">없음</p>}

			<ul className="-mx-2 grid gap-0.5">
				{users.map((user) => (
					<li key={user.id}>
						{/*사용자를 누르면 그 사용자의 응급 상황만 조회*/}
						<Link
							href={{ pathname: '/emergencies', query: toToggledQuery(query, 'keyword', user.id) }}
							scroll={false}
							aria-current={query.keyword === user.id ? 'true' : undefined}
							className="group grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 rounded-md p-2 hover:bg-muted aria-[current]:bg-muted"
						>
							<UserAvatar
								photoUrl={user.photo_file?.url}
								nickname={user.nickname}
								className="size-5 text-[11px]"
							/>
							<b className="truncate font-semibold">{user.nickname ?? '닉네임 없음'}</b>
							<strong className="font-bold tabular-nums">
								{(user.sound_count + user.vision_count).toLocaleString('ko-KR')}
							</strong>

							{/*오디오 및 비전을 이어서 표시*/}
							<span
								aria-hidden
								className="col-span-full flex h-2 overflow-hidden rounded-full bg-muted group-hover:bg-card group-aria-[current]:bg-card"
							>
								<span
									className="bg-chart-1"
									style={{ width: `${(user.sound_count / maxUserCount) * 100}%` }}
								/>
								<span
									className="bg-chart-2"
									style={{ width: `${(user.vision_count / maxUserCount) * 100}%` }}
								/>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default EmergencyUserCard;

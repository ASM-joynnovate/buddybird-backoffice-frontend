import type { UserListItem } from '@/types/apis/users';

import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';

import { Badge } from '@/components/ui/badge';

interface Props {
	user: Pick<UserListItem, 'photo_file' | 'nickname' | 'email' | 'is_anonymous'>;
}

/**
 * 사용자의 사진, 닉네임, 이메일 컴포넌트
 * @param user 표시할 사용자
 */
const UserSummary = ({ user }: Props) => {
	return (
		<>
			<UserAvatar
				photoUrl={user.photo_file?.url}
				nickname={user.nickname}
				className="transition-colors group-hover:bg-card"
			/>

			<span className="min-w-0">
				{user.nickname ? (
					<strong className="block truncate font-semibold">{user.nickname}</strong>
				) : (
					<span className="block text-muted-foreground">닉네임 없음</span>
				)}

				{/*배지 줄도 이메일 줄과 같은 높이*/}
				{user.is_anonymous ? (
					<span className="flex h-lh items-center text-[13px]">
						<Badge variant="muted" className="group-hover:bg-card">
							익명
						</Badge>
					</span>
				) : (
					<span className="block truncate text-[13px] text-muted-foreground">{user.email}</span>
				)}
			</span>
		</>
	);
};

export default UserSummary;

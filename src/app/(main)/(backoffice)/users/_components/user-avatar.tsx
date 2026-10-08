import Image from 'next/image';

import { cn } from '@/lib/utils';

import { UserRound } from 'lucide-react';

interface Props {
	photoUrl?: string;
	nickname: string | null;
	className?: string;
}

/**
 * 사용자의 프로필 사진 컴포넌트
 * @param photoUrl 프로필 사진 주소
 * @param nickname 사진이 없을 때 첫 글자를 표시할 닉네임
 * @param className 크기를 정하는 class
 */
const UserAvatar = ({ photoUrl, nickname, className }: Props) => {
	return (
		<span
			className={cn(
				'grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-muted font-bold text-muted-foreground',
				className,
			)}
		>
			{photoUrl ? (
				<Image src={photoUrl} alt="" width={56} height={56} unoptimized className="size-full object-cover" />
			) : (
				(nickname?.[0] ?? <UserRound className="size-1/2" />)
			)}
		</span>
	);
};

export default UserAvatar;

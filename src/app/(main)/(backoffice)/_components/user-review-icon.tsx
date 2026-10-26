import { cn } from '@/lib/utils';

import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface Props {
	correct: boolean;
	className?: string;
}

/**
 * 사용자 리뷰 아이콘 컴포넌트
 * @param correct 사용자가 맞다고 눌렀는지 여부
 * @param className 아이콘의 크기를 정하는 class
 */
const UserReviewIcon = ({ correct, className }: Props) => {
	const Icon = correct ? ThumbsUp : ThumbsDown;
	const label = correct ? '사용자 리뷰 맞음' : '사용자 리뷰 틀림';

	return (
		<Icon
			aria-label={label}
			className={cn('size-4 shrink-0', correct ? 'text-success' : 'text-destructive', className)}
		>
			<title>{label}</title>
		</Icon>
	);
};

export default UserReviewIcon;

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface Props {
	photoUrl?: string;
	name: string;
	className?: string;
}

/**
 * 앵무새 사진 컴포넌트
 * @param photoUrl 앵무새 사진 주소
 * @param name 사진이 없을 때 첫 글자를 표시할 앵무새 이름
 * @param className 크기를 정하는 class
 */
const ParrotPhoto = ({ photoUrl, name, className }: Props) => {
	return (
		<span
			className={cn(
				'grid size-9 shrink-0 place-items-center overflow-hidden rounded-md bg-muted font-bold text-muted-foreground',
				className,
			)}
		>
			{photoUrl ? (
				<Image src={photoUrl} alt="" width={56} height={56} unoptimized className="size-full object-cover" />
			) : (
				name[0]
			)}
		</span>
	);
};

export default ParrotPhoto;

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Bird } from 'lucide-react';

import { SPECIES_IDS } from '@/utils/species';

interface Props {
	species: string;
	className?: string;
}

/**
 * 앵무새 종 아이콘 컴포넌트
 * @param species 앵무새 종 ID
 * @param className 크기를 정하는 class
 */
const SpeciesIcon = ({ species, className }: Props) => {
	// 직접 입력한 종은 새 아이콘 표시
	if (!SPECIES_IDS.includes(species)) {
		return <Bird aria-hidden className={cn('size-5 shrink-0 text-muted-foreground', className)} />;
	}

	return (
		<Image
			src={`/images/species/${species}.webp`}
			alt=""
			width={20}
			height={20}
			unoptimized
			className={cn('size-5 shrink-0', className)}
		/>
	);
};

export default SpeciesIcon;

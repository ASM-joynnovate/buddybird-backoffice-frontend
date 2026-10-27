import { cn } from '@/lib/utils';

import { Bird } from 'lucide-react';

import { SPECIES_IDS } from '@/utils/species';
import { toSpriteStyle } from '@/utils/sprite';

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
	const speciesIndex = SPECIES_IDS.indexOf(species);

	// 직접 입력한 종은 새 아이콘 표시
	if (speciesIndex === -1) {
		return <Bird aria-hidden className={cn('size-5 shrink-0 text-muted-foreground', className)} />;
	}

	return (
		<span
			aria-hidden
			className={cn('inline-block size-5 shrink-0', className)}
			style={toSpriteStyle('/images/species.png', speciesIndex, SPECIES_IDS.length)}
		/>
	);
};

export default SpeciesIcon;

import type { UserDashboard } from '@/types/apis/dashboard';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { VISIBLE_SPECIES_COUNT } from '@/config';
import { toSpeciesName } from '@/utils/species';

interface Props {
	parrots: UserDashboard['parrots'];
}

/**
 * 앵무새 종 카드 컴포넌트
 * @param parrots 종별 앵무새 집계
 */
const SpeciesCard = ({ parrots }: Props) => {
	const maxCount = parrots.species[0]?.count;

	return (
		<TitledCard
			title="앵무새 종"
			action=<span className="text-[13px] text-muted-foreground">
				등록 {parrots.total_count.toLocaleString('ko-KR')}마리
			</span>
		>
			{parrots.species.length === 0 && <p className="text-muted-foreground">등록한 앵무새가 없습니다.</p>}

			<ul className="grid gap-2.5">
				{parrots.species.slice(0, VISIBLE_SPECIES_COUNT).map(({ species, count }) => (
					<li key={species} className="grid grid-cols-[104px_minmax(0,1fr)_40px] items-center gap-2.5">
						<span className="truncate font-semibold">{toSpeciesName(species)}</span>

						<div aria-hidden className="h-2 rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-chart-2"
								style={{ width: `${(count / maxCount) * 100}%` }}
							/>
						</div>

						<strong className="text-right font-bold tabular-nums">
							{Math.round((count / parrots.total_count) * 100)}%
						</strong>
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default SpeciesCard;

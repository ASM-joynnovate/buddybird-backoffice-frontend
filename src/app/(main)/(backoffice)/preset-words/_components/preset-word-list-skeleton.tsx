import { presetLanguageSchema } from '@/types/apis/preset-words';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toPresetLanguageName } from '@/utils/locale';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ITEM_COUNT = 6;

/** 단어 프리셋 목록을 불러오는 동안 보이는 컴포넌트 */
const PresetWordListSkeleton = () => {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 xl:grid-cols-2">
			{presetLanguageSchema.options.map((language) => (
				<TitledCard key={language} title={toPresetLanguageName(language)}>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 xl:grid-cols-2">
						{Array.from({ length: PLACEHOLDER_ITEM_COUNT }, (_, index) => (
							<Skeleton key={index} className="h-14 rounded-lg" />
						))}
					</div>
				</TitledCard>
			))}
		</div>
	);
};

export default PresetWordListSkeleton;

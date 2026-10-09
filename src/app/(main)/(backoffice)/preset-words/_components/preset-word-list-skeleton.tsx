import { presetLanguageSchema } from '@/types/apis/preset-words';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AddPresetWordButton from '@/app/(main)/(backoffice)/preset-words/_components/add-preset-word-button';
import { toPresetLanguageName } from '@/utils/locale';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ITEM_COUNT = 5;

/** 단어 프리셋 목록을 불러오는 동안 보이는 컴포넌트 */
const PresetWordListSkeleton = () => {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 xl:grid-cols-2">
			{presetLanguageSchema.options.map((language) => (
				<TitledCard
					key={language}
					title={toPresetLanguageName(language)}
					action=<Skeleton className="h-3.5 w-5" />
				>
					<ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 xl:grid-cols-2">
						{Array.from({ length: PLACEHOLDER_ITEM_COUNT }, (_, index) => (
							<li
								key={index}
								className="flex min-h-14 items-center gap-2.5 rounded-lg bg-muted py-2.5 pr-2 pl-2.5"
							>
								<Skeleton className="size-9 shrink-0 rounded-full bg-card" />

								{/*이름 줄 및 음성 길이 줄*/}
								<div className="flex-1">
									<SkeletonText className="w-16 *:bg-card" />
									<SkeletonText className="w-8 text-[13px] *:bg-card" />
								</div>
							</li>
						))}

						<li className="grid">
							<AddPresetWordButton language={language} />
						</li>
					</ul>
				</TitledCard>
			))}
		</div>
	);
};

export default PresetWordListSkeleton;

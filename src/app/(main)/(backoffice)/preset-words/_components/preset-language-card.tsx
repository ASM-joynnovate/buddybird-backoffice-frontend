import type { PresetLanguage, PresetWord } from '@/types/apis/preset-words';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AddPresetWordButton from '@/app/(main)/(backoffice)/preset-words/_components/add-preset-word-button';
import PresetWordItem from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-item';
import { toPresetLanguageName } from '@/utils/locale';

interface Props {
	language: PresetLanguage;
	presetWords: PresetWord[];
}

/**
 * 한 언어의 단어 프리셋 카드 컴포넌트
 * @param language 카드에 표시할 언어
 * @param presetWords 그 언어의 단어 프리셋 목록
 */
const PresetLanguageCard = ({ language, presetWords }: Props) => {
	const languageName = toPresetLanguageName(language);

	return (
		<TitledCard
			title={languageName}
			action=<span className="text-[13px] text-muted-foreground tabular-nums">{presetWords.length}개</span>
		>
			{presetWords.length === 0 && (
				<div className="pt-2 pb-4 text-center">
					<strong className="block font-semibold">{languageName} 프리셋이 없습니다</strong>
					<p className="text-[13px] text-muted-foreground">
						{languageName}로 가입한 사용자는 단어 없이 시작합니다.
					</p>
				</div>
			)}

			<ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 xl:grid-cols-2">
				{presetWords.map((presetWord) => (
					<PresetWordItem key={presetWord.id} presetWord={presetWord} />
				))}

				<li className="grid only:col-span-full">
					<AddPresetWordButton language={language} />
				</li>
			</ul>
		</TitledCard>
	);
};

export default PresetLanguageCard;

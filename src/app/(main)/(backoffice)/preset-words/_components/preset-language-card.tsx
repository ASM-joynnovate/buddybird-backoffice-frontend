import type { PresetLanguage, PresetWord } from '@/types/apis/preset-words';

import { TriangleAlert } from 'lucide-react';

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
			action={
				presetWords.length > 0 && (
					<span className="text-[13px] text-muted-foreground tabular-nums">{presetWords.length}개</span>
				)
			}
		>
			{presetWords.length === 0 && (
				<p className="mb-3 flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-[13px]">
					<TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
					{languageName} 사용자는 프리셋 단어 없이 가입합니다.
				</p>
			)}

			<ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 xl:grid-cols-4">
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

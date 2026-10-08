'use client';

import { presetLanguageSchema } from '@/types/apis/preset-words';

import { useGetPresetWordList } from '@/hooks/apis/preset-words';

import PresetLanguageCard from '@/app/(main)/(backoffice)/preset-words/_components/preset-language-card';

/** 언어별 단어 프리셋 목록 컴포넌트 */
const PresetWordList = () => {
	const { data: presetWordListData } = useGetPresetWordList();

	return (
		<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 xl:grid-cols-2">
			{presetLanguageSchema.options.map((language) => (
				<PresetLanguageCard
					key={language}
					language={language}
					presetWords={presetWordListData.filter((presetWord) => presetWord.language === language)}
				/>
			))}
		</div>
	);
};

export default PresetWordList;

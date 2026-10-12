'use client';

import { useState } from 'react';

import { type PresetLanguage, presetLanguageSchema } from '@/types/apis/preset-words';

import { useGetPresetWordList } from '@/hooks/apis/preset-words';

import { cn } from '@/lib/utils';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import PresetLanguageCard from '@/app/(main)/(backoffice)/preset-words/_components/preset-language-card';
import { toPresetLanguageName } from '@/utils/locale';

/** 언어 탭 및 선택한 언어의 단어 프리셋 목록 컴포넌트 */
const PresetWordList = () => {
	const { data: presetWordListData } = useGetPresetWordList();

	const [selectedLanguage, setSelectedLanguage] = useState<PresetLanguage>('ko');

	const selectedPresetWords = presetWordListData.filter((presetWord) => presetWord.language === selectedLanguage);

	return (
		<>
			<SegmentedControl
				label="언어"
				options={presetLanguageSchema.options.map((language) => {
					const presetWordCount = presetWordListData.filter(
						(presetWord) => presetWord.language === language,
					).length;

					return {
						value: language,
						label: (
							<>
								{toPresetLanguageName(language)}
								{/*프리셋이 없는 언어는 개수를 경고 색으로 표시*/}
								<span
									className={cn(
										'tabular-nums opacity-70',
										language !== selectedLanguage &&
											presetWordCount === 0 &&
											'text-warning opacity-100',
									)}
								>
									{presetWordCount}
								</span>
							</>
						),
					};
				})}
				value={selectedLanguage}
				className="max-w-full overflow-x-auto"
				onValueChange={setSelectedLanguage}
			/>

			<PresetLanguageCard language={selectedLanguage} presetWords={selectedPresetWords} />
		</>
	);
};

export default PresetWordList;

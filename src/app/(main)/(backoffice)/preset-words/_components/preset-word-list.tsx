'use client';

import { useGetPresetWordList } from '@/hooks/apis/preset-words';

import PresetWordRow from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-row';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** 단어 프리셋 목록 컴포넌트 */
const PresetWordList = () => {
	const { data: presetWordListData } = useGetPresetWordList();

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>언어</TableHead>
						<TableHead>이름</TableHead>
						<TableHead>오디오 상태</TableHead>
						<TableHead>관리</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{presetWordListData.map((presetWord) => (
						<PresetWordRow key={presetWord.id} presetWord={presetWord} />
					))}
				</TableBody>
			</Table>

			{presetWordListData.length === 0 && (
				<p className="text-sm text-muted-foreground">단어 프리셋이 없습니다.</p>
			)}
		</>
	);
};

export default PresetWordList;

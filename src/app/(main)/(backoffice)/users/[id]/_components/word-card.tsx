'use client';

import { useGetUserSessionList, useGetUserWordList } from '@/hooks/apis/users';

import { ChevronDown } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import RecordingItem from '@/app/(main)/(backoffice)/users/[id]/_components/recording-item';

import { Badge } from '@/components/ui/badge';

interface Props {
	id: string;
}

/**
 * 사용자의 단어 및 녹음 카드 컴포넌트
 * @param id 조회할 사용자 ID
 */
const WordCard = ({ id }: Props) => {
	const { data: userWordListData } = useGetUserWordList({ id });

	const { data: userSessionListData } = useGetUserSessionList({ id, page: 1 });

	const [lastSession] = userSessionListData.data;
	const learningWordId = lastSession?.status === 'running' ? lastSession.word.id : undefined;

	return (
		<TitledCard
			title="단어"
			action={
				userWordListData.length > 0 && (
					<span className="text-[13px] text-muted-foreground">{userWordListData.length}개</span>
				)
			}
		>
			{userWordListData.length === 0 && <p className="text-muted-foreground">단어가 없습니다.</p>}

			<div className="divide-y">
				{userWordListData.map((userWord, index) => (
					<details key={userWord.id} open={index === 0} className="group">
						<summary className="flex cursor-pointer list-none items-center gap-2 py-2.5 group-first:pt-0 [&::-webkit-details-marker]:hidden">
							<strong className="font-semibold">{userWord.name}</strong>

							{userWord.id === learningWordId && <ColorTag color="var(--chart-1)">학습 중</ColorTag>}
							{userWord.recordings.some((recording) => recording.is_preset) && (
								<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">프리셋</Badge>
							)}

							<span className="ml-auto text-muted-foreground">녹음 {userWord.recordings.length}개</span>
							<ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
						</summary>

						<ul className="pb-2.5">
							{userWord.recordings.map((recording, recordingIndex) => (
								<RecordingItem
									key={recording.id}
									audioUrl={recording.audio_file.url}
									label={recording.is_preset ? '프리셋 음성' : `녹음 ${recordingIndex + 1}`}
									wordName={userWord.name}
								/>
							))}
						</ul>
					</details>
				))}
			</div>
		</TitledCard>
	);
};

export default WordCard;

import { cn } from '@/lib/utils';

import { LoaderCircle } from 'lucide-react';

interface Props {
	label?: string;
	score: number | null;
	judging?: boolean;
	barClassName: string;
	trackClassName?: string;
}

/**
 * 점수 하나의 이름, 막대, 값 컴포넌트
 * @param label 점수의 이름
 * @param score 0부터 1까지의 점수
 * @param judging 점수를 아직 계산하는 중인지 여부
 * @param barClassName 막대의 색 class
 * @param trackClassName 막대의 폭을 정하는 class
 */
const SessionSoundScore = ({ label, score, judging = false, barClassName, trackClassName }: Props) => {
	return (
		<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
			{label}

			{score !== null && (
				<>
					<span aria-hidden className={cn('h-1.5 w-11 rounded-full bg-foreground/10', trackClassName)}>
						<span
							className={cn('block h-full rounded-full', barClassName)}
							style={{ width: `${score * 100}%` }}
						/>
					</span>
					<strong className="min-w-7.5 font-bold text-foreground tabular-nums">
						{Math.round(score * 100)}%
					</strong>
				</>
			)}

			{score === null && judging && (
				<LoaderCircle
					aria-label="판정 중"
					className="size-3.5 animate-spin text-info [animation-duration:1.2s] motion-reduce:animate-none"
					strokeWidth={2.5}
				>
					<title>판정 중</title>
				</LoaderCircle>
			)}

			{score === null && !judging && '-'}
		</span>
	);
};

export default SessionSoundScore;

import { cn } from '@/lib/utils';

import { Play, Square } from 'lucide-react';

interface Props {
	label: string;
	playing: boolean;
	progressPercent: number;
	onClick: () => void;
}

/**
 * 둘레에 재생한 만큼 표시하는 재생 버튼 컴포넌트
 * @param label 재생할 대상의 이름
 * @param playing 재생 중 여부
 * @param progressPercent 재생한 비율
 * @param onClick 누르면 실행할 함수
 */
const PlayButton = ({ label, playing, progressPercent, onClick }: Props) => {
	return (
		<button
			type="button"
			aria-label={`${label} ${playing ? '정지' : '재생'}`}
			className={cn(
				'relative grid size-9 shrink-0 place-items-center rounded-full bg-card text-foreground transition-colors hover:bg-chart-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
				playing && 'bg-foreground text-card hover:bg-foreground',
			)}
			onClick={onClick}
		>
			{/*둘레 3px에 진행한 만큼 표시*/}
			<svg aria-hidden viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90 fill-none stroke-3">
				<circle cx="18" cy="18" r="16.5" className="stroke-card" />
				<circle
					cx="18"
					cy="18"
					r="16.5"
					pathLength="100"
					strokeDasharray={`${playing ? progressPercent : 0} 100`}
					className="stroke-chart-1"
				/>
			</svg>

			{playing ? (
				<Square className="relative size-3 fill-current" />
			) : (
				<Play className="relative size-3.5 fill-current" />
			)}
		</button>
	);
};

export default PlayButton;

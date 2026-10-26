import { cn } from '@/lib/utils';

import { CircleCheck, CircleX, Undo2 } from 'lucide-react';

import { formatShortDateTime } from '@/utils/date';

interface LabelHistoryItem {
	id: string;
	target?: string;
	positive: boolean | null;
	result: string;
	score?: number | null;
	operatorName: string;
	memo: string | null;
	createdAt: string;
}

interface Props {
	labels: LabelHistoryItem[];
	className?: string;
}

/**
 * 라벨 수정 기록 컴포넌트
 * @param labels 오래된 순서의 라벨 기록
 * @param className 목록의 최대 높이를 정하는 class
 */
const LabelHistory = ({ labels, className }: Props) => {
	if (labels.length === 0) {
		return <p className="p-3 text-[13px] text-muted-foreground">기록 없음</p>;
	}

	return (
		<ol className={cn('[scrollbar-width:thin] overflow-y-auto overscroll-contain', className)}>
			{/*최근 기록부터 표시*/}
			{labels.toReversed().map((label) => {
				const ResultIcon = label.positive === null ? Undo2 : label.positive ? CircleCheck : CircleX;

				return (
					<li key={label.id} className="border-b px-3 py-2.5 last:border-b-0">
						{!!label.target && <p className="mb-1.5 text-[13px] font-bold">{label.target}</p>}

						<dl className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 gap-y-1 text-[13px]">
							<dt className="text-muted-foreground">결과</dt>
							<dd
								className={cn(
									'flex items-center gap-1.5 font-semibold',
									label.positive === null && 'text-muted-foreground',
									label.positive === true && 'text-success',
									label.positive === false && 'text-destructive',
								)}
							>
								<ResultIcon aria-hidden className="size-3.5" />
								{label.result}
							</dd>

							{label.score !== undefined && label.score !== null && (
								<>
									<dt className="text-muted-foreground">점수</dt>
									<dd className="font-semibold tabular-nums">{Math.round(label.score * 100)}%</dd>
								</>
							)}

							<dt className="text-muted-foreground">이름</dt>
							<dd>{label.operatorName}</dd>

							<dt className="text-muted-foreground">시각</dt>
							<dd>
								<time className="tabular-nums">{formatShortDateTime(label.createdAt)}</time>
							</dd>

							{!!label.memo && (
								<>
									<dt className="text-muted-foreground">메모</dt>
									<dd className="break-words whitespace-pre-wrap text-muted-foreground">
										{label.memo}
									</dd>
								</>
							)}
						</dl>
					</li>
				);
			})}
		</ol>
	);
};

export default LabelHistory;

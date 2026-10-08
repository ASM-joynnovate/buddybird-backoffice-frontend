import type { CSSProperties } from 'react';

interface Props {
	rows: { label: string; count: number }[];
	color: string;
}

/**
 * 첫 행에 대한 비율을 막대로 나타내는 행 목록 컴포넌트
 * @param rows 행마다 이름 및 인원
 * @param color 막대의 색
 */
const FunnelRows = ({ rows, color }: Props) => {
	const firstCount = rows[0]?.count ?? 0;

	return (
		<ul className="grid gap-2.5 tabular-nums" style={{ '--funnel-color': color } as CSSProperties}>
			{rows.map((row, index) => {
				const percent = firstCount ? Math.round((row.count / firstCount) * 100) : 0;

				return (
					<li key={row.label} className="grid grid-cols-[64px_minmax(0,1fr)_auto_40px] items-center gap-2.5">
						<span className="text-[13px] text-muted-foreground">{row.label}</span>
						<span className="h-2 rounded-full bg-muted">
							<span
								className="block h-full rounded-full bg-(--funnel-color)"
								style={{ width: `${percent}%` }}
							/>
						</span>
						<b className="min-w-14 text-right font-bold">{row.count.toLocaleString('ko-KR')}명</b>
						<span className="text-right text-[13px] whitespace-nowrap text-muted-foreground">
							{index > 0 && `${percent}%`}
						</span>
					</li>
				);
			})}
		</ul>
	);
};

export default FunnelRows;

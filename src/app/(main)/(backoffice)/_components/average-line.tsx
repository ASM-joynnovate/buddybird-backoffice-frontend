'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { type CartesianViewBox, ReferenceLine, usePlotArea } from 'recharts';

const LABEL_HEIGHT = 20;
const LABEL_GAP = 8;
const LABEL_INSET = 4;
const LABEL_PADDING_X = 8;
const DOT_WIDTH = 12;
const KEY_WIDTH = 28;

interface LabelProps {
	viewBox?: CartesianViewBox;
	valueText: string;
	color?: string;
	labelPosition: 'top' | 'bottom';
	labelAlign: 'start' | 'end';
}

/**
 * 평균선 끝의 평균 이름표 컴포넌트
 * @param viewBox 평균선의 위치
 * @param valueText 평균 값 문구
 * @param color 계열 색
 * @param labelPosition 평균선 기준 이름표 위치
 * @param labelAlign 이름표를 붙일 평균선 끝
 */
const AverageLineLabel = ({ viewBox, valueText, color, labelPosition, labelAlign }: LabelProps) => {
	const plotArea = usePlotArea();

	const valueTextRef = useRef<SVGTextElement>(null);

	const [valueTextWidth, setValueTextWidth] = useState(0);

	/** 값 문구의 너비 측정 */
	useLayoutEffect(() => {
		setValueTextWidth(valueTextRef.current?.getComputedTextLength() ?? 0);
	}, [valueText]);

	if (viewBox?.x === undefined || viewBox.y === undefined || viewBox.width === undefined || !plotArea) {
		return null;
	}

	// 위는 여백까지, 아래는 X축 위까지 사용
	const topY = viewBox.y - LABEL_GAP - LABEL_HEIGHT;
	const bottomY = viewBox.y + LABEL_GAP;
	const topFits = topY >= 0;
	const bottomFits = bottomY + LABEL_HEIGHT <= plotArea.y + plotArea.height;
	const y = (labelPosition === 'top' && topFits) || !bottomFits ? topY : bottomY;

	const keyOffset = LABEL_PADDING_X + (color ? DOT_WIDTH : 0);
	const width = keyOffset + KEY_WIDTH + valueTextWidth + LABEL_PADDING_X;
	const x = labelAlign === 'start' ? viewBox.x + LABEL_INSET : viewBox.x + viewBox.width - LABEL_INSET - width;

	return (
		<g className="text-[11.5px] tabular-nums">
			<rect x={x} y={y} width={width} height={LABEL_HEIGHT} rx={6} className="fill-card stroke-border" />
			{color && <circle cx={x + LABEL_PADDING_X + 3} cy={y + LABEL_HEIGHT / 2} r={3.5} fill={color} />}
			<text x={x + keyOffset} y={y + 14} className="fill-muted-foreground font-medium">
				평균
			</text>
			<text ref={valueTextRef} x={x + keyOffset + KEY_WIDTH} y={y + 14} className="fill-foreground font-bold">
				{valueText}
			</text>
		</g>
	);
};

interface Props {
	value: number;
	valueText: string;
	color?: string;
	labelPosition?: 'top' | 'bottom';
	labelAlign?: 'start' | 'end';
}

/**
 * 그래프의 평균 점선 컴포넌트
 * @param value 평균 값
 * @param valueText 이름표에 표시할 평균 값 문구
 * @param color 계열 색, 없으면 글자색
 * @param labelPosition 평균선 기준 이름표 위치
 * @param labelAlign 이름표를 붙일 평균선 끝
 */
const AverageLine = ({ value, valueText, color, labelPosition = 'top', labelAlign = 'start' }: Props) => {
	return (
		<ReferenceLine
			y={value}
			stroke={color ?? 'var(--foreground)'}
			strokeOpacity={color ? 1 : 0.55}
			strokeWidth={1.5}
			strokeDasharray="4 3"
			label=<AverageLineLabel
				valueText={valueText}
				color={color}
				labelPosition={labelPosition}
				labelAlign={labelAlign}
			/>
		/>
	);
};

export default AverageLine;

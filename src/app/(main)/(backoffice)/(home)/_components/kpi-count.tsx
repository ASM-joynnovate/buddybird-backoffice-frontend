interface Props {
	count: number;
	unit: string;
}

/**
 * 숫자 카드의 값 컴포넌트
 * @param count 표시할 개수
 * @param unit 개수 뒤에 붙는 단위
 */
const KpiCount = ({ count, unit }: Props) => {
	return (
		<p className="text-2xl leading-tight font-bold tracking-tight md:text-3xl">
			{count.toLocaleString('ko-KR')}
			<span className="ml-0.5 text-base font-semibold tracking-normal text-muted-foreground">{unit}</span>
		</p>
	);
};

export default KpiCount;

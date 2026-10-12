interface Props {
	text: string;
	columnTexts: string[];
}

/**
 * 같은 열의 가장 긴 글자에 너비를 맞추는 컴포넌트
 * @param text 표시할 글자
 * @param columnTexts 같은 열에 표시되는 모든 글자
 */
const SameWidthText = ({ text, columnTexts }: Props) => {
	return (
		<span className="grid whitespace-nowrap">
			{/*너비만 차지하는 보이지 않는 글자*/}
			{[...new Set(columnTexts)].map((columnText) => (
				<span key={columnText} aria-hidden className="invisible h-0">
					{columnText}
				</span>
			))}

			{text}
		</span>
	);
};

export default SameWidthText;

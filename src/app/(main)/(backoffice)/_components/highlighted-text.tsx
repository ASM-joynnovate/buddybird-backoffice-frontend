interface Props {
	text: string;
	keyword?: string;
}

/**
 * 검색어와 같은 글자를 강조하는 컴포넌트
 * @param text 표시할 글
 * @param keyword 강조할 검색어
 */
const HighlightedText = ({ text, keyword }: Props) => {
	if (!keyword) {
		return text;
	}

	const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// 홀수 번째가 검색어와 같은 글자
	return text.split(new RegExp(`(${escapedKeyword})`, 'gi')).map((part, index) =>
		index % 2 === 1 ? (
			<mark key={index} className="rounded-sm bg-warning-dot/34 px-px text-inherit">
				{part}
			</mark>
		) : (
			part
		),
	);
};

export default HighlightedText;

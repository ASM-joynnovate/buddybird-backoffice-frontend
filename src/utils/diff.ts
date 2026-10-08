export interface LineChange {
	type: 'same' | 'added' | 'removed';
	text: string;
}

/** 두 본문을 줄 단위로 비교하는 함수 */
export const diffLines = (before: string, after: string) => {
	const beforeLines = before.split('\n');
	const afterLines = after.split('\n');

	// 뒤에서부터 센 공통 줄 수
	const commonCounts = Array.from({ length: beforeLines.length + 1 }, () =>
		Array.from({ length: afterLines.length + 1 }, () => 0),
	);

	for (let i = beforeLines.length - 1; i >= 0; i--) {
		for (let j = afterLines.length - 1; j >= 0; j--) {
			commonCounts[i][j] =
				beforeLines[i] === afterLines[j]
					? commonCounts[i + 1][j + 1] + 1
					: Math.max(commonCounts[i + 1][j], commonCounts[i][j + 1]);
		}
	}

	const lineChanges: LineChange[] = [];
	let i = 0;
	let j = 0;

	while (i < beforeLines.length || j < afterLines.length) {
		if (i < beforeLines.length && j < afterLines.length && beforeLines[i] === afterLines[j]) {
			lineChanges.push({ type: 'same', text: afterLines[j] });
			i++;
			j++;
		} else if (
			i < beforeLines.length &&
			(j === afterLines.length || commonCounts[i + 1][j] >= commonCounts[i][j + 1])
		) {
			lineChanges.push({ type: 'removed', text: beforeLines[i] });
			i++;
		} else {
			lineChanges.push({ type: 'added', text: afterLines[j] });
			j++;
		}
	}

	// 빈 줄은 변경으로 표시하지 않음
	return lineChanges.flatMap((lineChange) => {
		if (lineChange.text) {
			return [lineChange];
		}

		return lineChange.type === 'removed' ? [] : [{ ...lineChange, type: 'same' as const }];
	});
};

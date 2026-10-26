import type { ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';

interface Props {
	title: string;
	action?: ReactNode;
	defaultOpen?: boolean;
	children?: ReactNode;
}

/**
 * 접을 수 있는 테두리 상자 컴포넌트
 * @param title 상자 제목
 * @param action 제목 오른쪽 끝에 표시할 내용
 * @param defaultOpen 처음에 펼칠지 여부
 * @param children 상자 내용
 */
const CollapsibleTitledBox = ({ title, action, defaultOpen = false, children }: Props) => {
	return (
		<details open={defaultOpen} className="group/box min-w-0 rounded-lg border bg-card">
			<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 group-open/box:border-b [&::-webkit-details-marker]:hidden">
				<h5 className="text-[13px] font-bold">{title}</h5>

				<span className="flex items-center gap-2.5">
					{action}
					<ChevronDown className="size-4 text-muted-foreground transition-transform group-open/box:rotate-180" />
				</span>
			</summary>

			{children}
		</details>
	);
};

export default CollapsibleTitledBox;

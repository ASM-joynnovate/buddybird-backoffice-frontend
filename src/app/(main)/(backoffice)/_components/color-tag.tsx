import type { CSSProperties, ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';

interface Props {
	color: string;
	children: ReactNode;
}

/**
 * 색 점이 있는 태그 컴포넌트
 * @param color 점 및 배경에 사용할 색
 * @param children 태그 문구
 */
const ColorTag = ({ color, children }: Props) => {
	return (
		<Badge
			className="gap-1.5 bg-(--tag-color)/12 text-foreground"
			style={{ '--tag-color': color } as CSSProperties}
		>
			<span className="size-2 rounded-full bg-(--tag-color)" />
			{children}
		</Badge>
	);
};

export default ColorTag;

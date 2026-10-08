import type { ReactNode } from 'react';

import Link from 'next/link';

import { ArrowUpRight, type LucideIcon } from 'lucide-react';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
	label: string;
	icon: LucideIcon;
	href?: string;
	linkLabel?: string;
	children: ReactNode;
}

/**
 * 숫자 하나를 보여 주는 카드 컴포넌트
 * @param label 숫자의 이름
 * @param icon 이름 앞에 표시할 아이콘
 * @param href 링크를 누르면 이동할 경로
 * @param linkLabel 링크를 설명하는 문구
 * @param children 숫자 및 설명
 */
const KpiCard = ({ label, icon: Icon, href, linkLabel, children }: Props) => {
	return (
		<Card className="gap-2 py-4">
			<CardHeader className="px-4.5">
				<CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
					<Icon className="size-4.5" />
					{label}
				</CardTitle>

				{!!href && (
					<CardAction>
						<Link href={href} aria-label={linkLabel} className="text-muted-foreground">
							<ArrowUpRight className="size-4" />
						</Link>
					</CardAction>
				)}
			</CardHeader>

			<CardContent className="space-y-1 px-4.5">{children}</CardContent>
		</Card>
	);
};

export default KpiCard;

import type { ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
	title: string;
	href?: string;
	linkLabel?: string;
	action?: ReactNode;
	className?: string;
	children: ReactNode;
}

/**
 * 제목이 있는 카드 컴포넌트
 * @param title 카드 제목
 * @param href 링크를 누르면 이동할 경로
 * @param linkLabel 링크 문구
 * @param action 제목 오른쪽 끝에 둘 보조 정보
 * @param className 카드에 더할 class
 * @param children 카드 내용
 */
const TitledCard = ({ title, href, linkLabel, action, className, children }: Props) => {
	return (
		<Card className={cn('gap-3.5 py-4.5', className)}>
			<CardHeader className="items-baseline px-5">
				<CardTitle className="font-bold">{title}</CardTitle>

				{!!href && (
					<CardAction className="self-auto">
						<Link href={href} className="font-semibold text-brand hover:underline hover:underline-offset-3">
							{linkLabel}
						</Link>
					</CardAction>
				)}

				{!!action && <CardAction className="self-auto">{action}</CardAction>}
			</CardHeader>

			<CardContent className="px-5">{children}</CardContent>
		</Card>
	);
};

export default TitledCard;

import type { ReactNode } from 'react';

import Link from 'next/link';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { toLinkQuery } from '@/utils/search-params';

interface Props {
	pathname: string;
	query: Record<string, SearchParamValue>;
	sort: string;
	defaultSort: string;
	className?: string;
	children: ReactNode;
}

/**
 * 목록 정렬 링크 컴포넌트
 * @param pathname 정렬하면 이동할 경로
 * @param query 현재 주소의 쿼리
 * @param sort 이 링크의 정렬 기준
 * @param defaultSort 쿼리가 없을 때의 정렬 기준
 * @param className 링크에 더할 class
 * @param children 열 제목
 */
const SortLink = ({ pathname, query, sort, defaultSort, className, children }: Props) => {
	const sorted = (query.sort ?? defaultSort) === sort;
	const ascending = sorted && query.order === 'asc';

	return (
		<Link
			href={{
				pathname,
				// 정렬 중인 열을 누르면 순서를 반대로 변경
				query: toLinkQuery({
					...query,
					sort: sort === defaultSort ? undefined : sort,
					order: sorted && !ascending ? 'asc' : undefined,
				}),
			}}
			scroll={false}
			aria-current={sorted ? 'true' : undefined}
			className={cn(
				'group inline-flex items-center gap-0.5 rounded-sm hover:text-foreground aria-[current]:font-bold aria-[current]:text-foreground',
				className,
			)}
		>
			{children}

			{!sorted && <ChevronDown className="size-3.5 opacity-0 group-hover:opacity-50" />}

			{sorted && !ascending && (
				<ChevronDown aria-label="내림차순" className="size-3.5">
					<title>내림차순</title>
				</ChevronDown>
			)}

			{ascending && (
				<ChevronUp aria-label="오름차순" className="size-3.5">
					<title>오름차순</title>
				</ChevronUp>
			)}
		</Link>
	);
};

export default SortLink;

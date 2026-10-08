'use client';

import { ViewTransition } from 'react';

import Link from 'next/link';

import type { FeedbackListParams } from '@/types/apis/feedback';

import { useGetFeedbackList } from '@/hooks/apis/feedback';
import { useNow } from '@/hooks/use-now';

import type { SearchParamValue } from '@/lib/api';

import FeedbackRow from '@/app/(main)/(backoffice)/feedback/_components/feedback-row';

import PageNavigation from '@/components/page-navigation';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
	listParams: FeedbackListParams;
	keyword?: string;
	filterSelected: boolean;
	query: Record<string, SearchParamValue>;
	initialNow: number;
}

/**
 * 피드백 목록 컴포넌트
 * @param listParams 목록 조회 조건
 * @param keyword 검색 입력에 적은 검색어
 * @param filterSelected 날짜, 앱 버전, 기기, 언어 조건을 골랐는지 여부
 * @param query 현재 주소의 쿼리
 * @param initialNow 서버가 화면을 그린 시각
 */
const FeedbackList = ({ listParams, keyword, filterSelected, query, initialNow }: Props) => {
	const { data: feedbackListData } = useGetFeedbackList(listParams);

	const now = useNow(initialNow);

	if (feedbackListData.data.length === 0) {
		return (
			<Card className="grid justify-items-center gap-2.5 px-4 pt-11 pb-9 text-center">
				{!!keyword && (
					<>
						<strong className="text-base font-bold">‘{keyword}’에 맞는 피드백이 없습니다</strong>
						<p className="text-muted-foreground">검색어를 줄이거나 조회 기간을 늘려 보세요.</p>
					</>
				)}

				{!keyword && filterSelected && (
					<>
						<strong className="text-base font-bold">조건에 맞는 피드백이 없습니다</strong>
						<p className="text-muted-foreground">위에서 고른 조건을 지우면 다른 피드백이 보입니다.</p>
					</>
				)}

				{!keyword && !filterSelected && (
					<>
						<strong className="text-base font-bold">이 기간에 받은 피드백이 없습니다</strong>
						<p className="text-muted-foreground">조회 기간을 늘리면 이전 피드백이 보입니다.</p>

						<Link
							href={{ pathname: '/feedback', query: { period: 90 } }}
							scroll={false}
							className={buttonVariants({ variant: 'outline' })}
						>
							최근 90일 보기
						</Link>
					</>
				)}
			</Card>
		);
	}

	return (
		<>
			<Card className="gap-0 px-5 py-4.5">
				{feedbackListData.data.map((feedback) => (
					<ViewTransition key={feedback.id} name={`feedback-${feedback.id}`}>
						<FeedbackRow feedback={feedback} keyword={keyword} now={now} />
					</ViewTransition>
				))}
			</Card>

			<PageNavigation meta={feedbackListData.meta} pathname="/feedback" query={query} />
		</>
	);
};

export default FeedbackList;

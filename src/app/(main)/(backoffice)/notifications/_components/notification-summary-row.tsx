'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

import type { I18nText } from '@/types/apis/common';
import type { NotificationKind } from '@/types/apis/notifications';

import { cn } from '@/lib/utils';

import { ChevronDown } from 'lucide-react';

import HighlightedText from '@/app/(main)/(backoffice)/_components/highlighted-text';
import NotificationKindTag from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import { koreanOrEnglishText } from '@/utils/i18n-text';

// 누르는 영역을 행 전체로 넓힌 버튼
export const rowButtonClassName =
	'text-left after:absolute after:inset-0 after:rounded-md focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand';

interface Props {
	id: string;
	kind: NotificationKind;
	title: I18nText;
	body: I18nText;
	imageUrl?: string;
	keyword?: string;
	sentAt: ReactNode;
	result: ReactNode;
	expanded: boolean;
	children: ReactNode;
	onToggle: () => void;
}

/**
 * 보낸 알림 목록의 행 컴포넌트
 * @param id 행의 id
 * @param kind 알림 종류
 * @param title 알림 제목
 * @param body 알림 본문
 * @param imageUrl 알림 사진의 주소
 * @param keyword 강조할 검색어
 * @param sentAt 일시 열에 표시할 내용
 * @param result 결과 열에 표시할 내용
 * @param expanded 상세 표시 여부
 * @param children 펼치면 표시할 상세
 * @param onToggle 행을 누르면 실행할 함수
 */
const NotificationSummaryRow = ({
	id,
	kind,
	title,
	body,
	imageUrl,
	keyword,
	sentAt,
	result,
	expanded,
	children,
	onToggle,
}: Props) => {
	const detailId = `notification-detail-${id}`;

	return (
		<article className="border-t first:border-t-0">
			<div className="group relative -mx-2 grid grid-cols-[auto_minmax(0,1fr)_16px] items-start gap-x-2.5 gap-y-2 rounded-md px-2 py-3.5 transition-colors hover:bg-muted md:grid-cols-[86px_70px_minmax(0,1fr)_140px_16px] md:gap-x-3.5">
				<div className="whitespace-nowrap text-muted-foreground tabular-nums max-md:col-start-2 max-md:row-start-1 max-md:*:ml-1.5 max-md:*:inline max-md:*:first:ml-0">
					{sentAt}
				</div>

				<span className="max-md:col-start-1 max-md:row-start-1">
					<NotificationKindTag kind={kind} />
				</span>

				<div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 max-md:col-span-full">
					<div className="min-w-0">
						<h3 className="font-semibold">
							<button
								type="button"
								aria-expanded={expanded}
								aria-controls={detailId}
								className={rowButtonClassName}
								onClick={onToggle}
							>
								<HighlightedText text={koreanOrEnglishText(title)} keyword={keyword} />
							</button>
						</h3>
						<p className="line-clamp-2 text-[13px] text-muted-foreground">
							<HighlightedText text={koreanOrEnglishText(body)} keyword={keyword} />
						</p>
					</div>

					{!!imageUrl && (
						<Image
							src={imageUrl}
							alt=""
							width={36}
							height={36}
							unoptimized
							className="size-9 rounded-sm object-cover"
						/>
					)}
				</div>

				<div className="grid min-w-0 justify-items-end gap-1 text-right tabular-nums max-md:col-span-full max-md:grid-cols-[auto_minmax(0,1fr)] max-md:items-center max-md:justify-items-start max-md:gap-3 max-md:text-left">
					{result}
				</div>

				<ChevronDown
					aria-hidden
					className={cn(
						'mt-0.5 size-4 text-muted-foreground transition-transform max-md:col-start-3 max-md:row-start-1',
						expanded && 'rotate-180',
					)}
				/>
			</div>

			{expanded && (
				<div id={detailId} className="mb-4">
					{children}
				</div>
			)}
		</article>
	);
};

export default NotificationSummaryRow;

'use client';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import { TITLE_MAX_LENGTH } from '@/config';

interface Props {
	locale: keyof I18nFieldValue;
	title: string;
	body: string;
	bodyMaxLength?: number;
	bodyClassName?: string;
	englishBodyRequired: boolean;
	lengthText: string;
	onTitleChange: (title: string) => void;
	onBodyChange: (body: string) => void;
	onFocus?: () => void;
}

/**
 * 한 언어의 제목 및 본문 입력 컴포넌트
 * @param locale 입력하는 언어
 * @param title 제목 입력값
 * @param body 본문 입력값
 * @param bodyMaxLength 본문의 최대 길이
 * @param bodyClassName 본문 입력에 더할 class
 * @param englishBodyRequired 영어 본문의 필수 여부
 * @param lengthText 헤더에 표시할 글자 수
 * @param onTitleChange 제목이 바뀔 때 실행할 함수
 * @param onBodyChange 본문이 바뀔 때 실행할 함수
 * @param onFocus 입력에 포커스하면 실행할 함수
 */
const LocaleTextField = ({
	locale,
	title,
	body,
	bodyMaxLength,
	bodyClassName,
	englishBodyRequired,
	lengthText,
	onTitleChange,
	onBodyChange,
	onFocus,
}: Props) => {
	const english = locale === 'en_us';
	const languageName = english ? '영어' : '한국어';

	return (
		<div
			className="rounded-lg border bg-card focus-within:border-chart-neutral focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand hover:border-chart-neutral"
			onFocus={onFocus}
		>
			<div className="flex h-9 items-center justify-between rounded-t-lg border-b bg-card-inset px-3">
				<h3 className="text-[13px] font-semibold">
					{languageName}
					{!english && <span className="ml-1 text-xs font-normal text-muted-foreground">선택</span>}
				</h3>
				<span className="text-[11.5px] text-muted-foreground tabular-nums">{lengthText}</span>
			</div>

			<input
				aria-label={`${languageName} 제목`}
				placeholder="제목"
				required={english}
				maxLength={TITLE_MAX_LENGTH}
				value={title}
				className="block h-10 w-full bg-transparent px-3 pt-1 font-bold outline-none placeholder:font-normal placeholder:text-muted-foreground"
				onChange={(event) => onTitleChange(event.target.value)}
			/>
			<textarea
				aria-label={`${languageName} 본문`}
				placeholder="본문"
				required={english && englishBodyRequired}
				maxLength={bodyMaxLength}
				value={body}
				className={cn(
					'block h-40 w-full resize-none [scrollbar-width:thin] bg-transparent px-3 pt-0.5 pb-3 leading-normal outline-none placeholder:text-muted-foreground',
					bodyClassName,
				)}
				onChange={(event) => onBodyChange(event.target.value)}
			/>
		</div>
	);
};

export default LocaleTextField;

'use client';

import { useId } from 'react';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

interface Props {
	locale: keyof I18nFieldValue;
	value: string;
	placeholder: string;
	invalid?: boolean;
	onValueChange: (value: string) => void;
}

/**
 * 한 언어의 여러 줄 입력 컴포넌트
 * @param locale 입력하는 언어
 * @param value 입력값
 * @param placeholder 입력이 비었을 때 표시할 문구
 * @param invalid 입력값의 오류 여부
 * @param onValueChange 입력값이 바뀔 때 실행할 함수
 */
const LocaleTextareaField = ({ locale, value, placeholder, invalid = false, onValueChange }: Props) => {
	const textareaId = useId();

	return (
		<div
			className={cn(
				'rounded-lg border bg-card focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand',
				invalid ? 'border-destructive' : 'focus-within:border-chart-neutral hover:border-chart-neutral',
			)}
		>
			<label
				htmlFor={textareaId}
				className="flex h-9 items-center rounded-t-lg border-b bg-card-inset px-3 text-[13px] font-semibold"
			>
				{locale === 'en_us' ? '영어' : '한국어'}
			</label>

			<textarea
				id={textareaId}
				placeholder={placeholder}
				value={value}
				aria-invalid={invalid}
				className="block h-44 w-full resize-none [scrollbar-width:thin] bg-transparent px-3 pt-2.5 pb-3 leading-normal outline-none placeholder:text-muted-foreground"
				onChange={(event) => onValueChange(event.target.value)}
			/>
		</div>
	);
};

export default LocaleTextareaField;

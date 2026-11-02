'use client';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import { AD_TEXT_FIELDS, type AdTextName } from '@/config/ad';
import { toI18nLocaleName } from '@/utils/i18n-text';

const fieldClassName = 'min-w-0 bg-transparent outline-none placeholder:text-muted-foreground';

interface Props {
	locale: keyof I18nFieldValue;
	textNames: AdTextName[];
	texts: Record<AdTextName, I18nFieldValue>;
	invalidTextName?: AdTextName;
	onTextChange: (textName: AdTextName, text: string) => void;
}

/**
 * 한 언어의 광고 문구 입력 컴포넌트
 * @param locale 입력하는 언어
 * @param textNames 표시할 문구의 순서
 * @param texts 문구마다 언어별 입력값
 * @param invalidTextName 오류가 있는 문구
 * @param onTextChange 문구가 변경될 때 실행할 함수
 */
const AdTextFields = ({ locale, textNames, texts, invalidTextName, onTextChange }: Props) => {
	const english = locale === 'en_us';
	const languageName = toI18nLocaleName(locale);

	return (
		<div className="min-w-0 overflow-hidden rounded-lg border bg-card focus-within:border-chart-neutral focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand hover:border-chart-neutral">
			<div className="flex h-9 items-center border-b bg-card-inset px-3">
				<h3 className="text-[13px] font-semibold">
					{languageName}
					{!english && <span className="ml-2 text-xs font-normal text-muted-foreground">선택</span>}
				</h3>
			</div>

			<div className="divide-y">
				{textNames.map((textName) => {
					const { label, required, maxLength, multiline, placeholder } = AD_TEXT_FIELDS[textName];
					const text = texts[textName][locale];
					const invalid = textName === invalidTextName;

					return (
						<label
							key={textName}
							className={cn(
								'grid grid-cols-[76px_minmax(0,1fr)_auto] gap-x-3 px-3',
								multiline ? 'min-h-24 items-start py-2.5' : 'h-11 items-center',
							)}
						>
							<span
								className={cn(
									'text-[13px] font-semibold text-muted-foreground',
									invalid && 'text-destructive',
								)}
							>
								{label}
							</span>

							{multiline ? (
								<textarea
									aria-label={`${languageName} ${label}`}
									aria-invalid={invalid}
									placeholder={placeholder}
									required={english && required}
									maxLength={maxLength}
									value={text}
									className={cn(
										fieldClassName,
										'field-sizing-content min-h-19 resize-none leading-normal',
									)}
									onChange={(event) => onTextChange(textName, event.target.value)}
								/>
							) : (
								<input
									aria-label={`${languageName} ${label}`}
									aria-invalid={invalid}
									placeholder={placeholder}
									required={english && required}
									maxLength={maxLength}
									value={text}
									className={cn(fieldClassName, 'h-full font-medium')}
									onChange={(event) => onTextChange(textName, event.target.value)}
								/>
							)}

							<span className="text-[11.5px] text-muted-foreground tabular-nums">
								{!!maxLength && `${text.length}/${maxLength}`}
							</span>
						</label>
					);
				})}
			</div>
		</div>
	);
};

export default AdTextFields;

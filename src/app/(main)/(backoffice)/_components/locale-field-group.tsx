'use client';

import type { ReactNode } from 'react';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import { I18N_LOCALES } from '@/config/locale';

interface Props {
	locale: keyof I18nFieldValue;
	summaryTexts: I18nFieldValue;
	englishRequired: boolean;
	children: ReactNode;
	onLocaleChange: (locale: keyof I18nFieldValue) => void;
}

/**
 * 언어 목록 및 선택한 언어의 입력 컴포넌트
 * @param locale 선택한 언어
 * @param summaryTexts 언어마다 목록에 첫 줄을 표시할 입력값
 * @param englishRequired 영어 문구의 필수 여부
 * @param children 선택한 언어의 입력
 * @param onLocaleChange 언어를 선택하면 실행할 함수
 */
const LocaleFieldGroup = ({ locale, summaryTexts, englishRequired, children, onLocaleChange }: Props) => {
	return (
		<div className="@container">
			<div className="grid items-start gap-2.5 @lg:grid-cols-[208px_minmax(0,1fr)]">
				{/*언어 다섯 개까지 보이고 넘으면 스크롤*/}
				<fieldset className="max-h-60.5 min-w-0 [scrollbar-width:thin] divide-y overflow-y-auto overscroll-contain rounded-lg border bg-card">
					<legend className="sr-only">입력할 언어</legend>

					{I18N_LOCALES.map((localeOption) => {
						const summaryText = summaryTexts[localeOption.locale].trim().split('\n')[0];

						return (
							<button
								key={localeOption.locale}
								type="button"
								aria-pressed={localeOption.locale === locale}
								className="group grid h-12 w-full min-w-0 content-center gap-px px-3 text-left hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand aria-pressed:bg-muted"
								onClick={() => onLocaleChange(localeOption.locale)}
							>
								<span className="flex items-baseline justify-between gap-1.5 text-[13px] font-semibold group-aria-pressed:font-bold">
									{localeOption.label}
									{englishRequired && localeOption.locale !== 'en_us' && (
										<span className="text-xs font-normal text-muted-foreground">선택</span>
									)}
								</span>

								{/*비워 둔 언어는 앱에서 영어 문구 표시*/}
								<span className={cn('truncate text-[12.5px]', !summaryText && 'text-muted-foreground')}>
									{summaryText || (localeOption.locale === 'en_us' ? '-' : '영어 문구 표시')}
								</span>
							</button>
						);
					})}
				</fieldset>

				{children}
			</div>
		</div>
	);
};

export default LocaleFieldGroup;

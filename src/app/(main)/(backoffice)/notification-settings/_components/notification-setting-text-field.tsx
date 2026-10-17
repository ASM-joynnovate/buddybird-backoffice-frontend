'use client';

import type { I18nFieldValue } from '@/types/i18n';

import LocaleFieldGroup from '@/app/(main)/(backoffice)/_components/locale-field-group';
import LocaleTextField from '@/app/(main)/(backoffice)/_components/locale-text-field';
import { TITLE_MAX_LENGTH } from '@/config';

interface Props {
	locale: keyof I18nFieldValue;
	title: I18nFieldValue;
	description: I18nFieldValue;
	error: string;
	onLocaleChange: (locale: keyof I18nFieldValue) => void;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
}

/**
 * 알림 설정의 언어별 제목 및 설명 입력 컴포넌트
 * @param locale 선택한 언어
 * @param title 언어별 제목 입력값
 * @param description 언어별 설명 입력값
 * @param error 입력값의 오류 문구
 * @param onLocaleChange 언어를 선택하면 실행할 함수
 * @param onTitleChange 선택한 언어의 제목이 바뀔 때 실행할 함수
 * @param onDescriptionChange 선택한 언어의 설명이 바뀔 때 실행할 함수
 */
const NotificationSettingTextField = ({
	locale,
	title,
	description,
	error,
	onLocaleChange,
	onTitleChange,
	onDescriptionChange,
}: Props) => {
	return (
		<div>
			<LocaleFieldGroup locale={locale} summaryTexts={title} englishRequired onLocaleChange={onLocaleChange}>
				<LocaleTextField
					locale={locale}
					title={title[locale]}
					body={description[locale]}
					bodyLabel="설명"
					englishBodyRequired={false}
					lengthText={`${title[locale].length}/${TITLE_MAX_LENGTH}`}
					onTitleChange={onTitleChange}
					onBodyChange={onDescriptionChange}
				/>
			</LocaleFieldGroup>

			{!!error && (
				<p role="alert" className="mt-1.5 text-[13px] text-destructive">
					{error}
				</p>
			)}
		</div>
	);
};

export default NotificationSettingTextField;

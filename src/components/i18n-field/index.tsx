'use client';

import type { I18nFieldValue } from '@/types/i18n';

import I18nFieldControl from '@/components/i18n-field/control';

interface Props {
	legend: string;
	value: I18nFieldValue;
	rule?: { required?: boolean; maxLength?: number };
	multiline?: boolean;
	onValueChange: (value: I18nFieldValue) => void;
}

/**
 * 한국어 및 영어 문구 입력 컴포넌트
 * @param legend 입력 항목 이름
 * @param value 입력값
 * @param rule 영어 문구 필수 여부 및 최대 길이
 * @param multiline 여러 줄 입력 여부
 * @param onValueChange 입력값이 바뀔 때 실행할 함수
 */
const I18nField = ({ legend, value, rule, multiline = false, onValueChange }: Props) => {
	return (
		<fieldset className="space-y-2">
			<legend className="text-sm font-medium">{legend}</legend>

			<I18nFieldControl
				label="한국어"
				value={value.ko_kr}
				rule={{ maxLength: rule?.maxLength }}
				multiline={multiline}
				onValueChange={(ko_kr) => onValueChange({ ...value, ko_kr })}
			/>
			<I18nFieldControl
				label="영어"
				value={value.en_us}
				rule={rule}
				multiline={multiline}
				onValueChange={(en_us) => onValueChange({ ...value, en_us })}
			/>
		</fieldset>
	);
};

export default I18nField;

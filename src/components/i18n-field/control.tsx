'use client';

import { useId } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
	label: string;
	value: string;
	rule?: { required?: boolean; maxLength?: number };
	multiline: boolean;
	onValueChange: (value: string) => void;
}

/**
 * 한 언어의 문구 입력 컴포넌트
 * @param label 언어 이름
 * @param value 입력값
 * @param rule 필수 여부 및 최대 길이
 * @param multiline 여러 줄 입력 여부
 * @param onValueChange 입력값이 바뀔 때 실행할 함수
 */
const I18nFieldControl = ({ label, value, rule, multiline, onValueChange }: Props) => {
	const id = useId();

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>

			{multiline ? (
				<Textarea
					id={id}
					value={value}
					required={rule?.required}
					maxLength={rule?.maxLength}
					onChange={(event) => onValueChange(event.target.value)}
				/>
			) : (
				<Input
					id={id}
					value={value}
					required={rule?.required}
					maxLength={rule?.maxLength}
					onChange={(event) => onValueChange(event.target.value)}
				/>
			)}
		</div>
	);
};

export default I18nFieldControl;

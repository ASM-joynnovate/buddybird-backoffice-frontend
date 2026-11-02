'use client';

import { useId } from 'react';

const COLOR_PATTERN = '#[0-9a-fA-F]{6}';

interface Props {
	label: string;
	ariaLabel: string;
	value: string;
	required?: boolean;
	onValueChange: (value: string) => void;
}

/**
 * '#rrggbb' 형식의 색 입력 컴포넌트
 * @param label 입력 앞에 표시할 이름
 * @param ariaLabel 입력의 이름
 * @param value '#rrggbb' 형식의 값
 * @param required 값이 꼭 필요한지 여부
 * @param onValueChange 값이 변경될 때 실행할 함수
 */
const ColorInput = ({ label, ariaLabel, value, required, onValueChange }: Props) => {
	const inputId = useId();

	const colorValid = new RegExp(`^${COLOR_PATTERN}$`).test(value);

	return (
		<div className="inline-flex h-9 items-stretch overflow-hidden rounded-md border bg-card text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand has-[input:user-invalid]:border-destructive">
			<label
				htmlFor={inputId}
				className="flex items-center border-r bg-card-inset px-2.5 text-[13px] font-semibold text-muted-foreground"
			>
				{label}
			</label>

			<span className="flex items-center gap-2 px-3">
				{/*값이 비어 있으면 검은색 표시*/}
				<input
					type="color"
					aria-label={`${ariaLabel} 선택`}
					value={colorValid ? value : '#000000'}
					className="size-5 shrink-0 cursor-pointer appearance-none rounded-sm bg-transparent ring-1 ring-foreground/10 [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
					onChange={(event) => onValueChange(event.target.value)}
				/>
				<input
					id={inputId}
					aria-label={ariaLabel}
					placeholder="#000000"
					required={required}
					pattern={COLOR_PATTERN}
					maxLength={7}
					value={value}
					className="w-17 bg-transparent font-semibold tabular-nums outline-none placeholder:font-normal placeholder:text-muted-foreground"
					onChange={(event) => onValueChange(event.target.value)}
				/>
			</span>
		</div>
	);
};

export default ColorInput;

import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

interface Props extends ComponentProps<typeof Input> {
	value: string;
	maxLength: number;
}

/**
 * 오른쪽 끝에 글자 수를 표시하는 입력 컴포넌트
 * @param value 입력값
 * @param maxLength 최대 길이
 */
const CountedInput = ({ value, maxLength, className, ...props }: Props) => {
	return (
		<div className="relative">
			<Input value={value} maxLength={maxLength} className={cn('pr-14', className)} {...props} />
			<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[12.5px] text-muted-foreground tabular-nums">
				{value.length}/{maxLength}
			</span>
		</div>
	);
};

export default CountedInput;

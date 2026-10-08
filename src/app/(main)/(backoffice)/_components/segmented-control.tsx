'use client';

import { type ComponentProps, type ReactNode, useId } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

const sizeClassNames = {
	default: { group: 'h-9 border-border', item: 'px-3.5' },
	sm: { group: 'h-7 border-transparent', item: 'px-2.5 text-[13px]' },
};

const itemClassName =
	'inline-flex items-center gap-1.5 rounded-sm font-semibold whitespace-nowrap text-muted-foreground hover:text-foreground';

interface Props<T extends string | number | boolean> {
	label: string;
	options: { value: T; label: ReactNode; href?: ComponentProps<typeof Link>['href']; disabled?: boolean }[];
	value?: T;
	size?: keyof typeof sizeClassNames;
	className?: string;
	onValueChange?: (value: T) => void;
}

/**
 * 값 하나를 고르는 버튼 그룹 컴포넌트
 * @param label 그룹의 이름
 * @param options 고를 수 있는 버튼 목록
 * @param value 고른 값
 * @param size 그룹의 크기
 * @param className 그룹에 더할 class
 * @param onValueChange 값을 고르면 실행할 함수
 */
const SegmentedControl = <T extends string | number | boolean>({
	label,
	options,
	value,
	size = 'default',
	className,
	onValueChange,
}: Props<T>) => {
	const radioName = useId();

	const groupClassName = cn(
		'inline-flex w-fit min-w-0 rounded-md border bg-card p-0.5 text-sm',
		sizeClassNames[size].group,
		className,
	);

	// 주소가 있으면 링크로 표시
	if (options.some((option) => option.href)) {
		return (
			<nav aria-label={label} className={groupClassName}>
				{options.map((option) => (
					<Link
						key={String(option.value)}
						href={option.href ?? ''}
						scroll={false}
						aria-current={option.value === value ? 'true' : undefined}
						className={cn(
							itemClassName,
							sizeClassNames[size].item,
							option.value === value && 'bg-foreground text-card hover:text-card',
						)}
					>
						{option.label}
					</Link>
				))}
			</nav>
		);
	}

	return (
		<fieldset className={groupClassName}>
			<legend className="sr-only">{label}</legend>

			{options.map((option) => (
				<label
					key={String(option.value)}
					className={cn(
						itemClassName,
						sizeClassNames[size].item,
						'cursor-pointer has-checked:bg-foreground has-checked:text-card has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand has-disabled:pointer-events-none has-disabled:opacity-40',
					)}
				>
					<input
						type="radio"
						name={radioName}
						checked={option.value === value}
						disabled={option.disabled}
						className="sr-only"
						onChange={() => onValueChange?.(option.value)}
					/>
					{option.label}
				</label>
			))}
		</fieldset>
	);
};

export default SegmentedControl;

import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { GripVertical } from 'lucide-react';

interface Props extends ComponentProps<'button'> {
	label: string;
}

/**
 * 끌어서 순서를 바꾸는 손잡이 컴포넌트
 * @param label 옮길 대상의 이름
 */
const DragHandle = ({ label, className, ...props }: Props) => {
	return (
		<button
			type="button"
			aria-label={`${label} 순서 변경`}
			className={cn(
				'grid h-7 w-5 shrink-0 cursor-grab touch-none place-items-center rounded-sm text-muted-foreground hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:cursor-grabbing disabled:cursor-default disabled:opacity-40',
				className,
			)}
			{...props}
		>
			<GripVertical className="size-4" />
		</button>
	);
};

export default DragHandle;

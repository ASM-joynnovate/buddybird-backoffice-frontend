import { cn } from '@/lib/utils';

import { CircleCheck, CircleX } from 'lucide-react';

interface Props {
	correct: boolean;
	label: string;
	className?: string;
}

/**
 * 맞음 또는 틀림 아이콘 컴포넌트
 * @param correct 맞음 여부
 * @param label 아이콘의 이름
 * @param className 아이콘의 크기를 정하는 class
 */
const CorrectnessIcon = ({ correct, label, className }: Props) => {
	const Icon = correct ? CircleCheck : CircleX;

	return (
		<Icon
			aria-label={label}
			className={cn('size-4 shrink-0', correct ? 'text-success' : 'text-destructive', className)}
		>
			<title>{label}</title>
		</Icon>
	);
};

export default CorrectnessIcon;

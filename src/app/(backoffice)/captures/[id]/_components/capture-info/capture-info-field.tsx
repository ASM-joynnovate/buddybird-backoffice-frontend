import { ReactNode } from 'react';

interface CaptureInfoFieldProps {
	label: string;
	value: ReactNode;
	className?: string;
}

export default function CaptureInfoField({ label, value, className = 'text-sm font-semibold' }: CaptureInfoFieldProps) {
	return (
		<div>
			<dt className="text-xs font-medium text-muted-foreground">{label}</dt>
			<dd className={className}>{value}</dd>
		</div>
	);
}

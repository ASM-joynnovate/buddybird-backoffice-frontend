import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { ConsentStatus } from '@/utils/consent';

import { Badge } from '@/components/ui/badge';

const statusTags = {
	live: { label: '게시 중', className: 'bg-success/10 text-success' },
	scheduled: { label: '예약', className: 'bg-info/10 text-info' },
	past: { label: '지난 버전', className: 'bg-muted text-muted-foreground' },
};

interface Props {
	status: ConsentStatus;
	children?: ReactNode;
}

/**
 * 고지문 버전의 상태 태그 컴포넌트
 * @param status 버전의 게시 상태
 * @param children 기본 문구 대신 표시할 문구
 */
const ConsentStatusTag = ({ status, children }: Props) => {
	return (
		<Badge className={cn('rounded-sm font-bold tabular-nums', statusTags[status].className)}>
			{children ?? statusTags[status].label}
		</Badge>
	);
};

export default ConsentStatusTag;

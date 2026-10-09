import type { ReactNode } from 'react';

import type { ConsentStatus } from '@/utils/consent';

import { Badge } from '@/components/ui/badge';

const statusTags = {
	live: { label: '게시 중', variant: 'success' },
	scheduled: { label: '예약', variant: 'info' },
	past: { label: '지난 버전', variant: 'muted' },
} as const;

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
		<Badge variant={statusTags[status].variant} className="tabular-nums">
			{children ?? statusTags[status].label}
		</Badge>
	);
};

export default ConsentStatusTag;

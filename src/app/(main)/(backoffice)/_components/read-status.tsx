import { Mail, MailOpen } from 'lucide-react';

import { formatShortDateTime } from '@/utils/date';

interface Props {
	readAt: string | null;
}

/**
 * 읽은 일시 또는 읽지 않음 아이콘 컴포넌트
 * @param readAt 읽은 일시
 */
const ReadStatus = ({ readAt }: Props) => {
	if (!readAt) {
		return (
			<Mail aria-label="읽지 않음" className="size-4 text-muted-foreground">
				<title>읽지 않음</title>
			</Mail>
		);
	}

	return (
		<span className="inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap text-muted-foreground tabular-nums">
			<MailOpen aria-label="읽음" className="size-4 text-success">
				<title>읽음</title>
			</MailOpen>
			{formatShortDateTime(readAt)}
		</span>
	);
};

export default ReadStatus;

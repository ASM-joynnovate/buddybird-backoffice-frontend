'use client';

import { useGetUserConsentList } from '@/hooks/apis/users';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	id: string;
}

/**
 * 사용자의 동의 내역 카드 컴포넌트
 * @param id 조회할 사용자 ID
 */
const ConsentCard = ({ id }: Props) => {
	const { data: userConsentListData } = useGetUserConsentList({ id });

	return (
		<TitledCard title="동의">
			{userConsentListData.length === 0 ? (
				<p className="text-muted-foreground">동의 기록이 없습니다.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="pl-0 text-muted-foreground">결정 일시</TableHead>
							<TableHead className="text-muted-foreground">고지문</TableHead>
							<TableHead className="text-muted-foreground">버전</TableHead>
							<TableHead className="text-muted-foreground">결정</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{userConsentListData.map((userConsent) => (
							<TableRow key={`${userConsent.consent_id}:${userConsent.decided_at}`}>
								<TableCell className="py-2.5 pl-0 text-muted-foreground tabular-nums">
									{formatDateTime(userConsent.decided_at)}
								</TableCell>
								<TableCell className="min-w-50 py-2.5 whitespace-normal">
									{koreanOrEnglishText(userConsent.title)}
								</TableCell>
								<TableCell className="py-2.5 text-muted-foreground tabular-nums">
									{userConsent.version}
								</TableCell>
								<TableCell className="py-2.5">
									{userConsent.status === 'granted' ? (
										<Badge className="rounded-sm bg-success/10 font-bold text-success">동의</Badge>
									) : (
										<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">
											거부
										</Badge>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</TitledCard>
	);
};

export default ConsentCard;

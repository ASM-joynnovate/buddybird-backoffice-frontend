'use client';

import { useGetConsentList } from '@/hooks/apis/consents';

import ConsentRow from '@/app/(main)/(backoffice)/consents/_components/consent-row';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** 고지문 목록 컴포넌트 */
const ConsentList = () => {
	const { data: consentListData } = useGetConsentList();

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>종류</TableHead>
						<TableHead>버전</TableHead>
						<TableHead>제목</TableHead>
						<TableHead>필수 여부</TableHead>
						<TableHead>게시 일시</TableHead>
						<TableHead>관리</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{consentListData.map((consent) => (
						<ConsentRow key={consent.id} consent={consent} />
					))}
				</TableBody>
			</Table>

			{consentListData.length === 0 && <p className="text-sm text-muted-foreground">고지문이 없습니다.</p>}
		</>
	);
};

export default ConsentList;

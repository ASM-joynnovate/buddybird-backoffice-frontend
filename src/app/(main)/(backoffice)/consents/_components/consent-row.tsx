'use client';

import { useState } from 'react';

import type { Consent } from '@/types/apis/consents';

import dayjs from 'dayjs';

import ConsentFormDialog from '@/app/(main)/(backoffice)/consents/_components/consent-form-dialog';
import DeleteConsentDialog from '@/app/(main)/(backoffice)/consents/_components/delete-consent-dialog';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';
import { yesNoText } from '@/utils/yes-no';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
	consent: Consent;
}

/**
 * 고지문 목록의 행 컴포넌트
 * @param consent 표시할 고지문
 */
const ConsentRow = ({ consent }: Props) => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const consentPublished = dayjs(consent.published_at).isBefore(dayjs());

	return (
		<TableRow>
			<TableCell>{consent.kind}</TableCell>
			<TableCell>{consent.version}</TableCell>
			<TableCell>{koreanOrEnglishText(consent.title)}</TableCell>
			<TableCell>{yesNoText(consent.is_required)}</TableCell>
			<TableCell>{formatDateTime(consent.published_at)}</TableCell>
			<TableCell>
				{consentPublished ? (
					'게시됨'
				) : (
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={() => setFormDialogOpen(true)}>
							수정
						</Button>
						<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
							삭제
						</Button>
					</div>
				)}

				{formDialogOpen && <ConsentFormDialog consent={consent} onClose={() => setFormDialogOpen(false)} />}

				<DeleteConsentDialog
					open={deleteDialogOpen}
					consent={consent}
					onClose={() => setDeleteDialogOpen(false)}
				/>
			</TableCell>
		</TableRow>
	);
};

export default ConsentRow;

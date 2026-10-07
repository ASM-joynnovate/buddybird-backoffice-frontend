'use client';

import { useState } from 'react';

import type { Announcement } from '@/types/apis/announcements';

import AnnouncementFormDialog from '@/app/(main)/(backoffice)/announcements/_components/announcement-form-dialog';
import AnnouncementImageDialog from '@/app/(main)/(backoffice)/announcements/_components/announcement-image-dialog';
import DeleteAnnouncementDialog from '@/app/(main)/(backoffice)/announcements/_components/delete-announcement-dialog';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';
import { yesNoText } from '@/utils/yes-no';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
	announcement: Announcement;
}

/**
 * 공지 목록의 행 컴포넌트
 * @param announcement 표시할 공지
 */
const AnnouncementRow = ({ announcement }: Props) => {
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [imageDialogOpen, setImageDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	return (
		<TableRow>
			<TableCell>{koreanOrEnglishText(announcement.title)}</TableCell>
			<TableCell>{formatDateTime(announcement.starts_at)}</TableCell>
			<TableCell>{announcement.ends_at ? formatDateTime(announcement.ends_at) : '-'}</TableCell>
			<TableCell>
				{yesNoText(announcement.push_enabled)}
				{!!announcement.push_local_time && ` ${announcement.push_local_time}`}
			</TableCell>
			<TableCell>{announcement.push_prepared_at ? formatDateTime(announcement.push_prepared_at) : '-'}</TableCell>
			<TableCell>{announcement.images.length}</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setFormDialogOpen(true)}>
						수정
					</Button>
					<Button variant="outline" onClick={() => setImageDialogOpen(true)}>
						사진
					</Button>
					<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
						삭제
					</Button>
				</div>

				{formDialogOpen && (
					<AnnouncementFormDialog announcement={announcement} onClose={() => setFormDialogOpen(false)} />
				)}

				{imageDialogOpen && (
					<AnnouncementImageDialog announcement={announcement} onClose={() => setImageDialogOpen(false)} />
				)}

				<DeleteAnnouncementDialog
					open={deleteDialogOpen}
					announcement={announcement}
					onClose={() => setDeleteDialogOpen(false)}
				/>
			</TableCell>
		</TableRow>
	);
};

export default AnnouncementRow;

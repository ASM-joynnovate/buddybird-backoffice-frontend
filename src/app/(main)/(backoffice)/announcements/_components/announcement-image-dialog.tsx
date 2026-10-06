'use client';

import { type SubmitEvent, useState } from 'react';

import Image from 'next/image';

import type { Announcement } from '@/types/apis/announcements';

import { useDeleteAnnouncementImage, useUploadAnnouncementImage } from '@/hooks/apis/announcements';

import { IMAGE_CONTENT_TYPES } from '@/config';
import { useMessageStore } from '@/providers/stores/message';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Props {
	announcement: Announcement;
	onClose: () => void;
}

/**
 * 공지 사진 관리 다이얼로그 컴포넌트
 * @param announcement 사진을 관리할 공지
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const AnnouncementImageDialog = ({ announcement, onClose }: Props) => {
	const [imageFile, setImageFile] = useState<File>();

	const uploadAnnouncementImage = useUploadAnnouncementImage();
	const deleteAnnouncementImage = useDeleteAnnouncementImage();

	const openPopup = useMessageStore((state) => state.openPopup);

	const imageRequestPending = uploadAnnouncementImage.isPending || deleteAnnouncementImage.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !imageRequestPending) {
			onClose();
		}
	};

	const handleUploadImage = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (imageRequestPending) {
			return;
		}

		// 빈 값은 required 속성이 제출 전에 막으므로 타입만 좁힌다
		if (!imageFile) {
			return;
		}

		const uploadForm = event.currentTarget;

		uploadAnnouncementImage.mutate(
			{ id: announcement.id, file: imageFile },
			{
				onSuccess: () => {
					setImageFile(undefined);
					uploadForm.reset();

					openPopup({ title: '사진을 업로드했습니다.', content: '서버 확인이 끝나면 목록에 표시됩니다.' });
				},
			},
		);
	};

	const handleDeleteImage = (imageId: string) => {
		if (imageRequestPending) {
			return;
		}

		deleteAnnouncementImage.mutate({ id: announcement.id, imageId });
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>공지 사진</DialogTitle>
					<DialogDescription>{koreanOrEnglishText(announcement.title)}</DialogDescription>
				</DialogHeader>

				{announcement.images.length === 0 ? (
					<p className="text-sm text-muted-foreground">사진이 없습니다.</p>
				) : (
					<div className="space-y-2">
						{announcement.images.map((image) => (
							<div key={image.id} className="flex items-center justify-between">
								<Image src={image.url} alt="공지 사진" width={96} height={96} unoptimized />

								<Button
									variant="destructive"
									disabled={imageRequestPending}
									onClick={() => handleDeleteImage(image.id)}
								>
									삭제
								</Button>
							</div>
						))}
					</div>
				)}

				<form onSubmit={handleUploadImage} className="flex items-center gap-2">
					<Input
						type="file"
						required
						accept={IMAGE_CONTENT_TYPES.join(',')}
						disabled={imageRequestPending}
						aria-label="사진 파일"
						onChange={(event) => setImageFile(event.target.files?.[0])}
					/>

					<Button type="submit" disabled={imageRequestPending}>
						업로드
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AnnouncementImageDialog;

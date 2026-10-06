'use client';

import { type ChangeEvent, useState } from 'react';

import { useUploadNotificationImage } from '@/hooks/apis/notifications';

import { IMAGE_CONTENT_TYPES } from '@/config';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	imageFileId: string | null;
	onImageFileIdChange: (imageFileId: string | null) => void;
}

/**
 * 알림 사진 업로드 컴포넌트
 * @param imageFileId 업로드한 사진의 file_id
 * @param onImageFileIdChange file_id가 바뀔 때 실행할 함수
 */
const NotificationImageField = ({ imageFileId, onImageFileIdChange }: Props) => {
	const [imageFile, setImageFile] = useState<File>();

	const { isPending, mutate } = useUploadNotificationImage();

	/** 파일을 다시 고르면 file_id 비우기 */
	const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		setImageFile(event.target.files?.[0]);

		onImageFileIdChange(null);
	};

	const handleUploadImage = () => {
		if (isPending || !imageFile) {
			return;
		}

		mutate({ file: imageFile }, { onSuccess: onImageFileIdChange });
	};

	return (
		<div className="space-y-2">
			<Label htmlFor="notification-image">사진</Label>

			<div className="flex items-center gap-2">
				<Input
					id="notification-image"
					type="file"
					accept={IMAGE_CONTENT_TYPES.join(',')}
					disabled={isPending}
					onChange={handleImageFileChange}
				/>
				<Button type="button" variant="outline" disabled={!imageFile || isPending} onClick={handleUploadImage}>
					업로드
				</Button>
			</div>

			{!!imageFileId && <p className="text-sm text-muted-foreground">업로드됨</p>}
			<p className="text-sm text-muted-foreground">
				사진은 업로드 뒤 서버 확인이 끝나야 발송에 사용할 수 있습니다.
			</p>
		</div>
	);
};

export default NotificationImageField;

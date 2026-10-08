'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';

import { useUploadNotificationImage } from '@/hooks/apis/notifications';

import { Upload, X } from 'lucide-react';

import { IMAGE_CONTENT_TYPES } from '@/config';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
	imageFileId: string | null;
	imagePreviewUrl: string | null;
	onImageChange: (image: { imageFileId: string | null; imagePreviewUrl: string | null }) => void;
}

/**
 * 알림 사진 업로드 컴포넌트
 * @param imageFileId 업로드한 사진의 file_id
 * @param imagePreviewUrl 고른 사진을 표시할 주소
 * @param onImageChange 사진이 바뀔 때 실행할 함수
 */
const NotificationImageField = ({ imageFileId, imagePreviewUrl, onImageChange }: Props) => {
	const imageInputRef = useRef<HTMLInputElement>(null);

	const [imageFile, setImageFile] = useState<File>();

	const { isPending, mutate } = useUploadNotificationImage();

	/** 사진을 다시 고르거나 지우면 file_id 비우기 */
	const changeImageFile = (nextImageFile?: File) => {
		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}

		setImageFile(nextImageFile);

		onImageChange({
			imageFileId: null,
			imagePreviewUrl: nextImageFile ? URL.createObjectURL(nextImageFile) : null,
		});
	};

	const handleClearImage = () => {
		if (imageInputRef.current) {
			imageInputRef.current.value = '';
		}

		changeImageFile();
	};

	const handleUploadImage = () => {
		if (isPending || !imageFile) {
			return;
		}

		mutate(
			{ file: imageFile },
			{ onSuccess: (uploadedFileId) => onImageChange({ imageFileId: uploadedFileId, imagePreviewUrl }) },
		);
	};

	return (
		<div>
			<input
				ref={imageInputRef}
				type="file"
				aria-label="사진"
				accept={IMAGE_CONTENT_TYPES.join(',')}
				disabled={isPending}
				className="sr-only"
				onChange={(event) => changeImageFile(event.target.files?.[0])}
			/>

			{imageFile ? (
				<div className="flex items-center gap-2.5 rounded-lg border p-2">
					{!!imagePreviewUrl && (
						<Image
							src={imagePreviewUrl}
							alt=""
							width={36}
							height={36}
							unoptimized
							className="size-9 shrink-0 rounded-sm object-cover"
						/>
					)}
					<strong className="truncate font-semibold">{imageFile.name}</strong>

					{imageFileId ? (
						<Badge className="rounded-sm bg-success/10 font-bold text-success">업로드됨</Badge>
					) : (
						<Button type="button" size="sm" disabled={isPending} onClick={handleUploadImage}>
							업로드
						</Button>
					)}

					<Button
						type="button"
						variant="outline"
						size="sm"
						className="ml-auto"
						disabled={isPending}
						onClick={() => imageInputRef.current?.click()}
					>
						변경
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label="사진 지우기"
						disabled={isPending}
						onClick={handleClearImage}
					>
						<X />
					</Button>
				</div>
			) : (
				<Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
					<Upload />
					사진 선택
				</Button>
			)}
		</div>
	);
};

export default NotificationImageField;

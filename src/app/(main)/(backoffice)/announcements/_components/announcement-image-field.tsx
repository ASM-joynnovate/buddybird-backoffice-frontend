'use client';

import { type ChangeEvent, useRef } from 'react';

import Image from 'next/image';

import type { Announcement } from '@/types/apis/announcements';

import { Upload, X } from 'lucide-react';

import { IMAGE_CONTENT_TYPES } from '@/config';

import { Button } from '@/components/ui/button';

export interface PickedImage {
	file: File;
	url: string;
}

interface Props {
	savedImages: Announcement['images'];
	pickedImages: PickedImage[];
	onSavedImageDelete: (imageId: string) => void;
	onImagePick: (pickedImage: PickedImage) => void;
	onPickedImageRemove: (pickedImage: PickedImage) => void;
}

/**
 * 공지 사진 입력 컴포넌트
 * @param savedImages 공지에 저장된 사진 중 지우지 않은 사진
 * @param pickedImages 새로 고른 사진 및 미리보기 주소
 * @param onSavedImageDelete 저장된 사진을 지우면 실행할 함수
 * @param onImagePick 사진을 고르면 실행할 함수
 * @param onPickedImageRemove 새로 고른 사진을 지우면 실행할 함수
 */
const AnnouncementImageField = ({
	savedImages,
	pickedImages,
	onSavedImageDelete,
	onImagePick,
	onPickedImageRemove,
}: Props) => {
	const imageInputRef = useRef<HTMLInputElement>(null);

	const images = [
		...savedImages.map((savedImage) => ({
			url: savedImage.url,
			onRemove: () => onSavedImageDelete(savedImage.id),
		})),
		...pickedImages.map((pickedImage) => ({
			url: pickedImage.url,
			onRemove: () => onPickedImageRemove(pickedImage),
		})),
	];

	const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0];

		if (file) {
			onImagePick({ file, url: URL.createObjectURL(file) });
		}

		// 같은 파일도 다시 선택 가능
		event.currentTarget.value = '';
	};

	return (
		<div>
			<input
				ref={imageInputRef}
				type="file"
				hidden
				accept={IMAGE_CONTENT_TYPES.join(',')}
				onChange={handleImagePick}
			/>

			<div className="flex flex-wrap items-center gap-2">
				{images.map((image, index) => (
					<span
						key={image.url}
						className="relative aspect-video w-24 overflow-hidden rounded-md bg-muted ring-1 ring-border"
					>
						<Image
							src={image.url}
							alt={`사진 ${index + 1}`}
							width={96}
							height={54}
							unoptimized
							className="size-full object-cover"
						/>

						<button
							type="button"
							aria-label={`사진 ${index + 1} 지우기`}
							className="absolute top-1 right-1 grid size-5 place-items-center rounded-sm bg-tooltip text-tooltip-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
							onClick={image.onRemove}
						>
							<X className="size-3" strokeWidth={2.25} />
						</button>
					</span>
				))}

				<Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
					<Upload />
					사진 추가
				</Button>
			</div>

			<p className="mt-2 text-[13px] text-muted-foreground">첫 번째 사진은 앱 팝업 및 푸시 알림에 표시됩니다.</p>
		</div>
	);
};

export default AnnouncementImageField;

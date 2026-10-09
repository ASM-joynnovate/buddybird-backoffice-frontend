'use client';

import { type ChangeEvent, useRef } from 'react';

import Image from 'next/image';

import { ImageIcon, X } from 'lucide-react';

import { IMAGE_CONTENT_TYPES } from '@/config';

import { Button } from '@/components/ui/button';

interface Props {
	imagePreviewUrl: string | null;
	onImageChange: (image: { imageFile: File | null; imagePreviewUrl: string | null }) => void;
}

/**
 * 알림 사진 선택 컴포넌트
 * @param imagePreviewUrl 고른 사진을 표시할 주소
 * @param onImageChange 사진이 바뀔 때 실행할 함수
 */
const NotificationImageField = ({ imagePreviewUrl, onImageChange }: Props) => {
	const imageInputRef = useRef<HTMLInputElement>(null);

	/** 이전 미리보기 주소를 지우고 사진 변경 */
	const changeImage = (image: { imageFile: File | null; imagePreviewUrl: string | null }) => {
		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}

		onImageChange(image);
	};

	const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0];

		// 같은 파일도 다시 선택 가능
		event.currentTarget.value = '';

		if (!file) {
			return;
		}

		changeImage({ imageFile: file, imagePreviewUrl: URL.createObjectURL(file) });
	};

	return (
		<div className="flex min-h-9 flex-wrap items-center gap-2.5">
			<input
				ref={imageInputRef}
				type="file"
				hidden
				accept={IMAGE_CONTENT_TYPES.join(',')}
				onChange={handleImagePick}
			/>

			{!!imagePreviewUrl && (
				<span className="relative h-14 w-24">
					<Image
						src={imagePreviewUrl}
						alt=""
						width={96}
						height={56}
						unoptimized
						className="size-full rounded-md object-cover"
					/>

					<button
						type="button"
						aria-label="사진 지우기"
						className="absolute top-1 right-1 grid size-5 place-items-center rounded-sm bg-tooltip text-tooltip-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
						onClick={() => changeImage({ imageFile: null, imagePreviewUrl: null })}
					>
						<X className="size-3" strokeWidth={2.5} />
					</button>
				</span>
			)}

			<Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
				<ImageIcon />
				{imagePreviewUrl ? '사진 변경' : '사진 추가'}
			</Button>
		</div>
	);
};

export default NotificationImageField;

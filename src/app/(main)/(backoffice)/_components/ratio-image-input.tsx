'use client';

import { type ChangeEvent, useRef, useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Upload } from 'lucide-react';

import { IMAGE_CONTENT_TYPES } from '@/config';

import { Spinner } from '@/components/ui/spinner';

const TILE_HEIGHT = 96;

interface Props {
	label: string;
	name?: string;
	imageUrl?: string;
	uploading: boolean;
	ratioWidth: number;
	ratioHeight: number;
	minWidth: number;
	minHeight: number;
	onImagePick: (file: File) => void;
}

/**
 * 비율 및 최소 크기에 맞는 사진만 선택하는 입력 컴포넌트
 * @param label 입력의 이름
 * @param name 사진 아래에 표시할 이름
 * @param imageUrl 선택한 사진의 주소
 * @param uploading 사진을 업로드하는 중인지 여부
 * @param ratioWidth 비율의 가로 값
 * @param ratioHeight 비율의 세로 값
 * @param minWidth 최소 가로 크기
 * @param minHeight 최소 세로 크기
 * @param onImagePick 맞는 사진을 선택하면 실행할 함수
 */
const RatioImageInput = ({
	label,
	name,
	imageUrl,
	uploading,
	ratioWidth,
	ratioHeight,
	minWidth,
	minHeight,
	onImagePick,
}: Props) => {
	const imageInputRef = useRef<HTMLInputElement>(null);

	const [shapeInvalid, setShapeInvalid] = useState(false);

	const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0];

		// 같은 파일도 다시 선택 가능
		event.currentTarget.value = '';

		if (!file) {
			return;
		}

		createImageBitmap(file)
			.then((imageBitmap) => {
				const { width, height } = imageBitmap;
				// 서버와 같은 1% 비율 오차 허용
				const ratioMismatch = Math.abs(width * ratioHeight - height * ratioWidth);
				const nextShapeInvalid =
					width < minWidth || height < minHeight || ratioMismatch > Math.floor((width * ratioHeight) / 100);

				imageBitmap.close();
				setShapeInvalid(nextShapeInvalid);

				if (!nextShapeInvalid) {
					onImagePick(file);
				}
			})
			// 읽지 못한 파일은 맞지 않는 사진
			.catch(() => setShapeInvalid(true));
	};

	return (
		<figure className="grid w-fit content-start gap-1.5">
			<input
				ref={imageInputRef}
				type="file"
				hidden
				accept={IMAGE_CONTENT_TYPES.join(',')}
				onChange={handleImagePick}
			/>

			<span className="relative block">
				<button
					type="button"
					aria-label={`${label} ${imageUrl ? '변경' : '선택'}`}
					className={cn(
						'relative grid place-items-center overflow-hidden rounded-md bg-muted text-muted-foreground ring-1 ring-border hover:ring-chart-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
						shapeInvalid && 'ring-destructive',
					)}
					style={{ height: TILE_HEIGHT, aspectRatio: `${ratioWidth} / ${ratioHeight}` }}
					onClick={() => imageInputRef.current?.click()}
				>
					{imageUrl ? (
						<>
							<Image
								src={imageUrl}
								alt={label}
								width={(TILE_HEIGHT * ratioWidth) / ratioHeight}
								height={TILE_HEIGHT}
								unoptimized
								className="size-full object-cover"
							/>

							<span className="absolute right-1.5 bottom-1.5 grid size-7 place-items-center rounded-sm bg-tooltip text-tooltip-foreground">
								<Upload className="size-3.5" />
							</span>
						</>
					) : (
						<Upload className="size-4.5" />
					)}

					{uploading && (
						<span className="absolute inset-0 grid place-items-center bg-card/60">
							<Spinner aria-label={`${label} 업로드 중`} />
						</span>
					)}
				</button>

				{/*폼 제출 때 필수 값 확인*/}
				<input
					tabIndex={-1}
					aria-hidden
					required
					value={imageUrl ?? ''}
					className="pointer-events-none absolute inset-0 opacity-0"
					onChange={() => undefined}
				/>
			</span>

			<figcaption className="grid gap-px">
				{!!name && <span className="text-[13px] font-semibold">{name}</span>}
				<span
					role={shapeInvalid ? 'alert' : undefined}
					className={cn(
						'text-[12.5px] text-muted-foreground tabular-nums',
						shapeInvalid && 'text-destructive',
					)}
				>
					{ratioWidth}:{ratioHeight}, {minWidth}×{minHeight} 이상
				</span>
			</figcaption>
		</figure>
	);
};

export default RatioImageInput;

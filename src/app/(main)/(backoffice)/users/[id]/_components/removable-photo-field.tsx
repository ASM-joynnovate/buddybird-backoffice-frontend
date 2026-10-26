import Image from 'next/image';

import { cn } from '@/lib/utils';

import { ImageIcon, Trash2 } from 'lucide-react';

import { toUploadedUrl } from '@/utils/file';

import { Button } from '@/components/ui/button';

interface Props {
	photoFile: { url: string; status: string } | null;
	removed: boolean;
	square?: boolean;
	onRemovedChange: (removed: boolean) => void;
}

/**
 * 저장할 때 삭제할 사진 입력 컴포넌트
 * @param photoFile 등록된 사진
 * @param removed 삭제 선택 여부
 * @param square 사각형 사진 여부
 * @param onRemovedChange 삭제를 선택하거나 되돌리면 실행할 함수
 */
const RemovablePhotoField = ({ photoFile, removed, square = false, onRemovedChange }: Props) => {
	const photoUrl = toUploadedUrl(photoFile);
	const shapeClassName = square ? 'rounded-lg' : 'rounded-full';

	return (
		<div className="flex items-center gap-3.5">
			{photoUrl && !removed ? (
				<Image
					src={photoUrl}
					alt=""
					width={64}
					height={64}
					unoptimized
					className={cn('size-16 object-cover', shapeClassName)}
				/>
			) : (
				<span className={cn('grid size-16 place-items-center bg-muted text-muted-foreground', shapeClassName)}>
					<ImageIcon className="size-5.5" />
				</span>
			)}

			{removed && <p className="text-[13px] text-muted-foreground">저장하면 삭제</p>}

			{!!photoFile &&
				(removed ? (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="ml-auto"
						onClick={() => onRemovedChange(false)}
					>
						되돌리기
					</Button>
				) : (
					<Button
						type="button"
						variant="destructive"
						size="sm"
						className="ml-auto"
						onClick={() => onRemovedChange(true)}
					>
						<Trash2 />
						사진 삭제
					</Button>
				))}
		</div>
	);
};

export default RemovablePhotoField;

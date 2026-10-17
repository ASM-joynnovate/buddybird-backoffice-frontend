'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

import DragHandle from '@/app/(main)/(backoffice)/_components/drag-handle';
import type { AnnouncementImageInput } from '@/app/(main)/(backoffice)/announcements/_components/announcement-image-field';

import { Spinner } from '@/components/ui/spinner';

interface Props {
	image: AnnouncementImageInput;
	index: number;
	onRemove: () => void;
}

/**
 * 끌어서 순서를 바꿀 수 있는 공지 사진 칸 컴포넌트
 * @param image 표시할 사진
 * @param index 사진의 순서
 * @param onRemove 사진을 지우면 실행할 함수
 */
const SortableAnnouncementImage = ({ image, index, onRemove }: Props) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: image.url,
	});

	const name = `사진 ${index + 1}`;

	return (
		<li
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
			className={cn(
				'relative aspect-video w-24 overflow-hidden rounded-md bg-muted ring-1 ring-border',
				isDragging && 'z-10 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]',
			)}
		>
			<Image src={image.url} alt={name} width={96} height={54} unoptimized className="size-full object-cover" />

			{!image.fileId && (
				<span className="absolute inset-0 grid place-items-center bg-card/60">
					<Spinner aria-label={`${name} 업로드 중`} />
				</span>
			)}

			<DragHandle
				ref={setActivatorNodeRef}
				label={name}
				className="absolute top-1 left-1 size-5 bg-tooltip text-tooltip-foreground hover:bg-tooltip hover:text-tooltip-foreground [&_svg]:size-3"
				{...attributes}
				{...listeners}
			/>

			<button
				type="button"
				aria-label={`${name} 지우기`}
				className="absolute top-1 right-1 grid size-5 place-items-center rounded-sm bg-tooltip text-tooltip-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				onClick={onRemove}
			>
				<X className="size-3" strokeWidth={2.25} />
			</button>
		</li>
	);
};

export default SortableAnnouncementImage;

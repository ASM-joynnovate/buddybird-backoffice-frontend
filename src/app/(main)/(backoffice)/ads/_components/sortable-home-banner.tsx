'use client';

import Image from 'next/image';

import type { Ad } from '@/types/apis/ads';

import { cn } from '@/lib/utils';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import DragHandle from '@/app/(main)/(backoffice)/_components/drag-handle';
import { koreanOrEnglishText } from '@/utils/i18n-text';

interface Props {
	ad: Ad;
}

/**
 * 드래그로 순서를 변경할 수 있는 홈 배너 칸 컴포넌트
 * @param ad 표시할 홈 배너
 */
const SortableHomeBanner = ({ ad }: Props) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: ad.id,
	});

	const advertiserName = koreanOrEnglishText(ad.advertiser_name);

	return (
		<li
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
			className={cn(
				'relative aspect-3/1 w-48 overflow-hidden rounded-md bg-muted ring-1 ring-border',
				isDragging && 'z-10 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]',
			)}
		>
			<Image
				src={ad.image_file.url}
				alt={`${advertiserName} 홈 배너`}
				width={192}
				height={64}
				unoptimized
				className="size-full object-cover"
			/>

			<DragHandle
				ref={setActivatorNodeRef}
				label={advertiserName}
				className="absolute top-1 left-1 size-5 bg-tooltip text-tooltip-foreground hover:bg-tooltip hover:text-tooltip-foreground [&_svg]:size-3"
				{...attributes}
				{...listeners}
			/>
		</li>
	);
};

export default SortableHomeBanner;

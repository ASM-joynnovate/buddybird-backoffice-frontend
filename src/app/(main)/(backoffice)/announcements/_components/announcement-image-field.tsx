'use client';

import { type ChangeEvent, useId, useRef } from 'react';

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Upload } from 'lucide-react';

import SortableAnnouncementImage from '@/app/(main)/(backoffice)/announcements/_components/sortable-announcement-image';
import { IMAGE_CONTENT_TYPES } from '@/config';
import { DRAG_ANNOUNCEMENTS, DRAG_SCREEN_READER_INSTRUCTIONS } from '@/config/drag';

import { Button } from '@/components/ui/button';

export interface AnnouncementImageInput {
	url: string;
	fileId: string | null;
}

interface Props {
	images: AnnouncementImageInput[];
	onImagePick: (file: File) => void;
	onImagesChange: (images: AnnouncementImageInput[]) => void;
}

/**
 * 공지 사진 입력 컴포넌트
 * @param images 표시 순서대로 나열한 사진, 업로드 중인 사진은 fileId가 null
 * @param onImagePick 사진을 선택하면 실행할 함수
 * @param onImagesChange 사진을 지우거나 순서를 바꾸면 실행할 함수
 */
const AnnouncementImageField = ({ images, onImagePick, onImagesChange }: Props) => {
	const imageInputRef = useRef<HTMLInputElement>(null);

	const dndContextId = useId();
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const imageUrls = images.map((image) => image.url);

	const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0];

		if (file) {
			onImagePick(file);
		}

		// 같은 파일도 다시 선택 가능
		event.currentTarget.value = '';
	};

	const handleImageRemove = (removedImage: AnnouncementImageInput) => {
		// 저장된 사진 주소는 해제 요청이 무시됨
		URL.revokeObjectURL(removedImage.url);

		onImagesChange(images.filter((image) => image !== removedImage));
	};

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) {
			return;
		}

		onImagesChange(arrayMove(images, imageUrls.indexOf(String(active.id)), imageUrls.indexOf(String(over.id))));
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
				<DndContext
					id={dndContextId}
					accessibility={{
						screenReaderInstructions: DRAG_SCREEN_READER_INSTRUCTIONS,
						announcements: DRAG_ANNOUNCEMENTS,
					}}
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={imageUrls} strategy={rectSortingStrategy}>
						<ul className="contents">
							{images.map((image, index) => (
								<SortableAnnouncementImage
									key={image.url}
									image={image}
									index={index}
									onRemove={() => handleImageRemove(image)}
								/>
							))}
						</ul>
					</SortableContext>
				</DndContext>

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

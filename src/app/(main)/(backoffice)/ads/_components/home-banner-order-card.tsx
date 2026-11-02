'use client';

import { useId } from 'react';

import type { AdListParams } from '@/types/apis/ads';

import { useGetAdList, useReorderHomeBanners } from '@/hooks/apis/ads';

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
import dayjs from 'dayjs';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import SortableHomeBanner from '@/app/(main)/(backoffice)/ads/_components/sortable-home-banner';
import { DRAG_ANNOUNCEMENTS, DRAG_SCREEN_READER_INSTRUCTIONS } from '@/config/drag';

interface Props {
	listParams: AdListParams;
	now: number;
}

/**
 * 홈 배너 순서 카드 컴포넌트
 * @param listParams 홈 배너 목록 조회 조건
 * @param now 서버가 화면을 렌더링한 시각
 */
const HomeBannerOrderCard = ({ listParams, now }: Props) => {
	const { data: adListData } = useGetAdList(listParams);

	const reorderHomeBanners = useReorderHomeBanners();

	const dndContextId = useId();
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	// 서버가 순서를 받는 종료되지 않은 홈 배너
	const banners = adListData.data
		.filter((ad) => !ad.ends_at || dayjs(ad.ends_at).isAfter(now))
		.toSorted((first, second) => (first.display_order ?? 0) - (second.display_order ?? 0));
	// 다시 조회할 때까지 변경한 순서 표시
	const bannerIds = reorderHomeBanners.isPending ? reorderHomeBanners.variables.ids : banners.map((ad) => ad.id);

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (reorderHomeBanners.isPending || !over || active.id === over.id) {
			return;
		}

		reorderHomeBanners.mutate({
			ids: arrayMove(bannerIds, bannerIds.indexOf(String(active.id)), bannerIds.indexOf(String(over.id))),
		});
	};

	return (
		<TitledCard title="홈 배너 순서">
			{banners.length === 0 ? (
				<p className="text-muted-foreground">홈 배너가 없습니다.</p>
			) : (
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
					<SortableContext items={bannerIds} strategy={rectSortingStrategy}>
						<ul className="flex flex-wrap items-center gap-2">
							{bannerIds.flatMap((bannerId) => {
								const banner = banners.find((ad) => ad.id === bannerId);

								return banner ? [<SortableHomeBanner key={banner.id} ad={banner} />] : [];
							})}
						</ul>
					</SortableContext>
				</DndContext>
			)}
		</TitledCard>
	);
};

export default HomeBannerOrderCard;

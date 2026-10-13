import Image from 'next/image';

import { formatShortDateTime } from '@/utils/date';

interface PetcamEvent {
	id: string;
	occurredAt: string;
	label: string;
	color: string;
	imageUrl?: string;
	videoUrl?: string;
}

interface Props {
	petcamEvents: PetcamEvent[];
}

/**
 * 펫캠 이벤트의 썸네일 및 영상 목록 컴포넌트
 * @param petcamEvents 썸네일이나 영상이 있는 펫캠 이벤트
 */
const SessionPetcamList = ({ petcamEvents }: Props) => {
	return (
		<section className="grid gap-2">
			<h4 className="font-bold">펫캠</h4>

			<ul className="flex [scrollbar-width:thin] gap-3 overflow-x-auto overscroll-x-contain pb-1">
				{petcamEvents.map((petcamEvent) => {
					const occurredTime = formatShortDateTime(petcamEvent.occurredAt);

					return (
						<li key={petcamEvent.id} className="grid w-60 shrink-0 gap-1.5">
							{/*영상이 있으면 썸네일을 영상의 첫 화면으로 표시*/}
							{petcamEvent.videoUrl ? (
								<video
									controls
									preload="none"
									poster={petcamEvent.imageUrl}
									src={petcamEvent.videoUrl}
									aria-label={`${occurredTime} ${petcamEvent.label} 영상`}
									className="aspect-video w-full rounded-md bg-muted"
								>
									<track kind="captions" />
								</video>
							) : (
								petcamEvent.imageUrl && (
									<Image
										src={petcamEvent.imageUrl}
										alt={`${occurredTime} ${petcamEvent.label} 사진`}
										width={240}
										height={135}
										unoptimized
										className="aspect-video w-full rounded-md bg-muted object-contain"
									/>
								)
							)}

							<p className="flex items-center gap-2 text-[13px] font-semibold">
								<span
									className="size-2 shrink-0 rounded-full"
									style={{ backgroundColor: petcamEvent.color }}
								/>
								<time className="font-normal text-muted-foreground tabular-nums">{occurredTime}</time>
								{petcamEvent.label}
							</p>
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default SessionPetcamList;

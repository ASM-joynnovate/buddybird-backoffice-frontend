import Image from 'next/image';

import { cn } from '@/lib/utils';

interface Props {
	title: string;
	body: string;
	prefix?: string;
	bodySuffix?: string;
	imageUrl?: string | null;
}

/**
 * 수신 기기에 표시되는 푸시 알림 모양의 컴포넌트
 * @param title 알림 제목
 * @param body 알림 본문
 * @param prefix 제목 및 본문 앞에 붙는 문구
 * @param bodySuffix 본문 뒤에 붙는 문구
 * @param imageUrl 알림 사진의 주소
 */
const PushPreviewCard = ({ title, body, prefix = '', bodySuffix = '', imageUrl }: Props) => {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 rounded-xl bg-card p-3 ring-1 ring-border">
			<p className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
				<Image src="/images/mascot.svg" alt="" width={18} height={18} />
				버디버드
				<span className="ml-auto">지금</span>
			</p>

			<div className="min-w-0 wrap-anywhere">
				<strong className={cn('block font-bold', !title && 'font-normal text-muted-foreground')}>
					{prefix}
					{title || '제목'}
				</strong>

				<p className={cn('text-[13px] leading-snug whitespace-pre-line', !body && 'text-muted-foreground')}>
					{prefix}
					{body || '본문'}
					{bodySuffix}
				</p>
			</div>

			{!!imageUrl && (
				<Image
					src={imageUrl}
					alt=""
					width={44}
					height={44}
					unoptimized
					className="size-11 rounded-md object-cover"
				/>
			)}
		</div>
	);
};

export default PushPreviewCard;

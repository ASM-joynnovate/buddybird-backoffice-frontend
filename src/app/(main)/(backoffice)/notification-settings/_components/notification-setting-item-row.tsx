import type { ComponentProps, CSSProperties, Ref } from 'react';

import type { NotificationSettingItem } from '@/types/apis/notification-settings';

import { cn } from '@/lib/utils';

import { ChevronRight } from 'lucide-react';

import DragHandle from '@/app/(main)/(backoffice)/_components/drag-handle';
import DefaultEnabledIcon from '@/app/(main)/(backoffice)/notification-settings/_components/default-enabled-icon';
import NotificationSettingKindTag from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-kind-tag';
import { koreanOrEnglishText } from '@/utils/i18n-text';

export const notificationSettingGridClassName =
	'grid grid-cols-[20px_minmax(0,1fr)_auto_14px] items-center gap-x-2.5 gap-y-1 [grid-template-areas:"grip_title_def_go"_"grip_kind_kind_kind"] md:grid-cols-[20px_minmax(0,1fr)_112px_64px_14px] md:gap-x-4 md:[grid-template-areas:"grip_title_kind_def_go"]';

export const notificationSettingRowClassName =
	'relative -mx-2 min-h-12 rounded-md px-2 py-2.5 before:absolute before:inset-x-2 before:top-0 before:border-t before:border-border';

export const placeholderRowClassName =
	'outline-[1.5px] -outline-offset-[1.5px] outline-chart-neutral outline-dashed before:hidden hover:bg-transparent *:invisible';

export const overlayRowClassName =
	'mx-0 cursor-grabbing bg-card shadow-[0_0_0_1px_var(--border),0_10px_24px_-8px_rgb(0_0_0/0.4)] before:hidden';

interface Props {
	item: NotificationSettingItem;
	grouped: boolean;
	ref?: Ref<HTMLLIElement>;
	style?: CSSProperties;
	className?: string;
	dragHandleProps?: Omit<ComponentProps<typeof DragHandle>, 'label'>;
	onOpen?: () => void;
}

/**
 * 알림 설정 항목 행 컴포넌트
 * @param item 표시할 항목
 * @param grouped 그룹에 속한 항목인지 여부
 * @param ref 행의 ref
 * @param style 행에 적용할 style
 * @param className 행에 더할 class
 * @param dragHandleProps 손잡이에 넘길 끌기 속성
 * @param onOpen 행을 누르면 실행할 함수
 */
const NotificationSettingItemRow = ({ item, grouped, ref, style, className, dragHandleProps, onOpen }: Props) => {
	const title = koreanOrEnglishText(item.title);

	return (
		<li
			ref={ref}
			style={style}
			className={cn(
				notificationSettingGridClassName,
				notificationSettingRowClassName,
				'transition-colors hover:bg-muted',
				className,
			)}
		>
			<DragHandle label={title} className="relative z-10 [grid-area:grip]" {...dragHandleProps} />

			<div className={cn('min-w-0 [grid-area:title]', grouped && 'border-l-2 border-chart-neutral pl-4')}>
				{/*누르는 영역을 행 전체로 넓힌 버튼*/}
				<button
					type="button"
					className="text-left font-semibold after:absolute after:inset-0 after:rounded-md focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
					onClick={onOpen}
				>
					{title}
				</button>
				{!!item.description && (
					<p className="text-[12.5px] text-muted-foreground">{koreanOrEnglishText(item.description)}</p>
				)}
			</div>

			<span className={cn('[grid-area:kind]', grouped && 'max-md:pl-4.5')}>
				<NotificationSettingKindTag kind={item.kind} />
			</span>

			<span className="[grid-area:def]">
				<DefaultEnabledIcon enabled={item.default_enabled} />
			</span>

			<ChevronRight aria-hidden className="size-3.5 text-muted-foreground [grid-area:go]" />
		</li>
	);
};

export default NotificationSettingItemRow;

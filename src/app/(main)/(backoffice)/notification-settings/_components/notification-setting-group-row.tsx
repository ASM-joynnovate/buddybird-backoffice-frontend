import type { ComponentProps, CSSProperties, Ref } from 'react';

import type { NotificationSettingGroup } from '@/types/apis/notification-settings';

import { cn } from '@/lib/utils';

import { ChevronRight } from 'lucide-react';

import DragHandle from '@/app/(main)/(backoffice)/_components/drag-handle';
import {
	notificationSettingGridClassName,
	notificationSettingRowClassName,
} from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-row';
import { koreanOrEnglishText } from '@/utils/i18n-text';

interface Props {
	group: NotificationSettingGroup;
	ref?: Ref<HTMLLIElement>;
	style?: CSSProperties;
	className?: string;
	dragHandleProps?: Omit<ComponentProps<typeof DragHandle>, 'label'>;
	onOpen?: () => void;
}

/**
 * 알림 설정 그룹 행 컴포넌트
 * @param group 표시할 그룹
 * @param ref 행의 ref
 * @param style 행에 적용할 style
 * @param className 행에 더할 class
 * @param dragHandleProps 손잡이에 넘길 끌기 속성
 * @param onOpen 행을 누르면 실행할 함수
 */
const NotificationSettingGroupRow = ({ group, ref, style, className, dragHandleProps, onOpen }: Props) => {
	const title = koreanOrEnglishText(group.title);

	return (
		<li
			ref={ref}
			style={style}
			className={cn(
				notificationSettingGridClassName,
				notificationSettingRowClassName,
				'bg-card-inset transition-colors hover:bg-muted',
				className,
			)}
		>
			<DragHandle label={title} className="relative z-10 [grid-area:grip]" {...dragHandleProps} />

			<div className="min-w-0 [grid-area:title]">
				{/*누르는 영역을 행 전체로 넓힌 버튼*/}
				<button
					type="button"
					className="text-left font-bold after:absolute after:inset-0 after:rounded-md focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
					onClick={onOpen}
				>
					{title}
				</button>
				{!!group.description && (
					<p className="text-[12.5px] text-muted-foreground">{koreanOrEnglishText(group.description)}</p>
				)}
			</div>

			<span className="text-muted-foreground [grid-area:kind]">그룹</span>

			<ChevronRight aria-hidden className="size-3.5 text-muted-foreground [grid-area:go]" />
		</li>
	);
};

export default NotificationSettingGroupRow;

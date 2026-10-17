import { Bell, BellOff } from 'lucide-react';

interface Props {
	enabled: boolean;
}

/**
 * 알림 설정 기본값 아이콘 컴포넌트
 * @param enabled 기본값으로 켜는지 여부
 */
const DefaultEnabledIcon = ({ enabled }: Props) => {
	return enabled ? (
		<Bell aria-label="기본값 켬" strokeWidth={2} className="size-4 shrink-0">
			<title>기본값 켬</title>
		</Bell>
	) : (
		<BellOff aria-label="기본값 끔" strokeWidth={2} className="size-4 shrink-0 text-muted-foreground">
			<title>기본값 끔</title>
		</BellOff>
	);
};

export default DefaultEnabledIcon;

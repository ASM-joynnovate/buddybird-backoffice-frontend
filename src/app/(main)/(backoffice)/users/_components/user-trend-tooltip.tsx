import dayjs from 'dayjs';
import type { TooltipContentProps, TooltipValueType } from 'recharts';

/**
 * 사용자 추이 그래프의 툴팁 컴포넌트
 * @param active 툴팁 표시 여부
 * @param payload 가리킨 날짜의 값
 * @param label 가리킨 날짜
 */
const UserTrendTooltip = ({
	active,
	payload,
	label,
}: Partial<TooltipContentProps<TooltipValueType, number | string>>) => {
	const dailyCount = payload?.[0]?.payload as { total: number; signup: number; withdrawal: number } | undefined;

	if (!active || !dailyCount) {
		return null;
	}

	return (
		<div className="grid gap-1 rounded-lg bg-tooltip px-3 py-2 text-xs text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]">
			<strong className="text-[13px] font-bold">전체 {dailyCount.total.toLocaleString('ko-KR')}명</strong>
			<span className="text-tooltip-foreground/75">가입 {dailyCount.signup}명</span>
			<span className="text-tooltip-foreground/75">탈퇴 {-dailyCount.withdrawal}명</span>
			<span className="text-tooltip-foreground/75">{dayjs(label).format('M월 D일')}</span>
		</div>
	);
};

export default UserTrendTooltip;

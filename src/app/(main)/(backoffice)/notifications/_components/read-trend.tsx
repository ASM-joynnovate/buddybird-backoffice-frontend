'use client';

import type { NotificationDispatch } from '@/types/apis/notifications';

import { useGetNotificationDispatch } from '@/hooks/apis/notifications';

import dayjs from 'dayjs';
import { Bar, BarChart, type BarShapeProps, LabelList, Rectangle, XAxis, YAxis } from 'recharts';

import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import ReadTrendTick from '@/app/(main)/(backoffice)/notifications/_components/read-trend-tick';
import ReadTrendTooltip from '@/app/(main)/(backoffice)/notifications/_components/read-trend-tooltip';
import { HOUR } from '@/config/units';

import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

const MIN_AXIS_COUNT = 4;
const WAITING_BAR_HEIGHT = 4;
const TICK_HOURS = [0, 6, 12, 18, 24, 30, 36, 42];

interface Props {
	notificationDispatch: NotificationDispatch;
	now: number;
}

/**
 * 발송 뒤 1시간마다 읽은 사람 수의 그래프 컴포넌트
 * @param notificationDispatch 조회할 발송
 * @param now 현재 시각
 */
const ReadTrend = ({ notificationDispatch, now }: Props) => {
	const { data: dispatchDetailData } = useGetNotificationDispatch({ id: notificationDispatch.id });

	const firstSentAt = dayjs(dispatchDetailData.send_times[0]?.sent_at ?? dispatchDetailData.created_at).valueOf();
	const elapsedHours = (now - firstSentAt) / HOUR;

	const passedReads = dispatchDetailData.hourly_reads.filter(({ hour }) => hour < elapsedHours);
	const peakCount = Math.max(0, ...passedReads.map(({ count }) => count));
	const peakHour = passedReads.find(({ count }) => count === peakCount)?.hour;
	const firstHourCount = dispatchDetailData.hourly_reads.find(({ hour }) => hour === 0)?.count ?? 0;
	const firstHourPercent = dispatchDetailData.sent_count
		? Math.round((firstHourCount / dispatchDetailData.sent_count) * 100)
		: 0;

	// 지난 시간은 옅게, 지금 지나고 있는 시간은 진하게 표시
	const hourlyReads = dispatchDetailData.hourly_reads.map(({ hour, count }) => ({
		hour,
		count,
		waiting: hour >= elapsedHours,
		fillOpacity: hour === Math.ceil(elapsedHours) - 1 ? 1 : 0.42,
		peakLabel: peakCount > 0 && hour === peakHour ? `${count.toLocaleString('ko-KR')}명` : undefined,
	}));
	const maxAxisCount = Math.max(MIN_AXIS_COUNT, peakCount);

	return (
		<>
			<div className="flex min-h-7 items-center justify-between gap-3">
				<h4 className="text-[13px] font-semibold">읽음 추이</h4>
				<p className="text-[13px] text-muted-foreground">
					1시간 안에 <b className="font-bold text-foreground tabular-nums">{firstHourPercent}%</b>
				</p>
			</div>

			<ChartContainer
				config={{ count: { label: '읽음', color: NOTIFICATION_KINDS[notificationDispatch.kind].color } }}
				className="aspect-auto h-30 w-full"
			>
				<BarChart
					accessibilityLayer
					title="발송 뒤 1시간마다 읽은 사람 수"
					data={hourlyReads}
					margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
				>
					<XAxis
						dataKey="hour"
						tickLine={false}
						axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.5 }}
						ticks={TICK_HOURS}
						interval={0}
						tick=<ReadTrendTick />
					/>
					<YAxis
						width={30}
						tickLine={false}
						axisLine={false}
						domain={[0, maxAxisCount]}
						ticks={[0, maxAxisCount]}
					/>
					<ChartTooltip cursor={false} content=<ReadTrendTooltip elapsedHours={elapsedHours} /> />
					<Bar
						dataKey="count"
						name="읽음"
						fill="var(--color-count)"
						radius={[4, 4, 0, 0]}
						maxBarSize={8}
						activeBar={{ fillOpacity: 1 }}
						isAnimationActive={false}
						// 아직 지나지 않은 시간은 낮은 회색 막대
						shape={(shapeProps: BarShapeProps) =>
							hourlyReads[shapeProps.index]?.waiting ? (
								<rect
									x={shapeProps.x}
									y={shapeProps.y + shapeProps.height - WAITING_BAR_HEIGHT}
									width={shapeProps.width}
									height={WAITING_BAR_HEIGHT}
									rx={WAITING_BAR_HEIGHT / 2}
									className="fill-chart-neutral/50"
								/>
							) : (
								<Rectangle {...shapeProps} />
							)
						}
					>
						<LabelList dataKey="peakLabel" position="top" className="fill-foreground text-xs font-bold" />
					</Bar>
				</BarChart>
			</ChartContainer>
		</>
	);
};

export default ReadTrend;

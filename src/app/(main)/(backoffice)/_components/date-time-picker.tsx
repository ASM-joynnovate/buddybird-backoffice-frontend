'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { CalendarDays } from 'lucide-react';
import { ko } from 'react-day-picker/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DEFAULT_TIME = '00:00';

interface Props {
	id?: string;
	value: string;
	ariaLabel: string;
	required?: boolean;
	invalid?: boolean;
	className?: string;
	onValueChange: (value: string) => void;
}

/**
 * 날짜 및 시각 선택 컴포넌트
 * @param id 라벨과 연결할 버튼의 id
 * @param value 'YYYY-MM-DDTHH:mm' 형식의 값
 * @param ariaLabel 입력의 이름
 * @param required 값이 꼭 필요한지 여부
 * @param invalid 값이 잘못됐는지 여부
 * @param className 폭을 정하는 class
 * @param onValueChange 값을 고르면 실행할 함수
 */
const DateTimePicker = ({ id, value, ariaLabel, required, invalid, className, onValueChange }: Props) => {
	const [calendarOpen, setCalendarOpen] = useState(false);

	const [date, time = DEFAULT_TIME] = value ? value.split('T') : [];

	const handleSelectDate = (selectedDate?: Date) => {
		if (!selectedDate) {
			return;
		}

		onValueChange(`${dayjs(selectedDate).format('YYYY-MM-DD')}T${time}`);
	};

	const handleClear = () => {
		onValueChange('');
		setCalendarOpen(false);
	};

	return (
		<div className={cn('relative inline-flex', className)}>
			<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
				<PopoverTrigger
					id={id}
					aria-label={ariaLabel}
					aria-invalid={invalid}
					className="inline-flex h-9 w-full items-center gap-1.5 rounded-md border bg-card px-3 font-semibold tabular-nums hover:bg-muted aria-invalid:border-destructive"
				>
					<CalendarDays className="size-4 text-muted-foreground" />
					{value ? (
						dayjs(value).format('YYYY. MM. DD. HH:mm')
					) : (
						<span className="font-medium text-muted-foreground">날짜 선택</span>
					)}
				</PopoverTrigger>

				<PopoverContent align="start" sideOffset={12} className="w-auto p-1">
					<Calendar
						mode="single"
						locale={ko}
						selected={date ? dayjs(date).toDate() : undefined}
						defaultMonth={date ? dayjs(date).toDate() : undefined}
						onSelect={handleSelectDate}
					/>

					<div className="mx-2 mb-2 flex items-center justify-between gap-2">
						<Input
							type="time"
							aria-label={`${ariaLabel} 시각`}
							disabled={!date}
							value={time}
							className="w-auto font-semibold tabular-nums [&::-webkit-calendar-picker-indicator]:hidden"
							onChange={(event) => onValueChange(`${date}T${event.target.value || DEFAULT_TIME}`)}
						/>

						{/*필수가 아니면 값을 비울 수 있음*/}
						{!required && !!value && (
							<Button type="button" variant="ghost" size="sm" onClick={handleClear}>
								지우기
							</Button>
						)}
					</div>
				</PopoverContent>
			</Popover>

			{/*폼 제출 때 필수 값 확인*/}
			<input
				tabIndex={-1}
				aria-hidden
				required={required}
				value={value}
				className="pointer-events-none absolute inset-0 opacity-0"
				onChange={() => undefined}
			/>
		</div>
	);
};

export default DateTimePicker;

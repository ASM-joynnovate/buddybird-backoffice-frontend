'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { useRouter, useSearchParams } from 'next/navigation';

import { LabelStatusEnum, LabelStatusLabel } from '@/types/audio-capture';

import { cn } from '@/lib/utils';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatRange = (range?: DateRange) => {
	if (!range?.from) return '기간 선택';
	const f = (d: Date) => format(d, 'yyyy.MM.dd', { locale: ko });
	return range.to ? `${f(range.from)} - ${f(range.to)}` : f(range.from);
};

export default function CaptureFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [labelStatus, setLabelStatus] = useState(searchParams.get('labelStatus') ?? LabelStatusEnum.ALL);

	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		const from = searchParams.get('dateFrom');
		const to = searchParams.get('dateTo');
		return from || to ? { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined } : undefined;
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();

		for (const [key, value] of formData.entries()) {
			if (typeof value === 'string' && value.trim()) {
				params.set(key, value.trim());
			}
		}

		if (dateRange?.from) params.set('dateFrom', dateRange.from.toISOString());
		if (dateRange?.to) params.set('dateTo', dateRange.to.toISOString());

		router.push(`/captures?${params.toString()}`);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
			<div className="space-y-1">
				<Label htmlFor="firebaseAnonUid">사용자 ID</Label>
				<Input
					id="firebaseAnonUid"
					name="firebaseAnonUid"
					defaultValue={searchParams.get('firebaseAnonUid') ?? ''}
					placeholder="Firebase UID"
					className="w-48"
				/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="wordLabel">단어</Label>
				<Input
					id="wordLabel"
					name="wordLabel"
					defaultValue={searchParams.get('wordLabel') ?? ''}
					placeholder="단어명"
					className="w-36"
				/>
			</div>
			<div className="space-y-1">
				<Label>라벨링 상태</Label>
				<Select
					name="labelStatus"
					value={labelStatus}
					onValueChange={(v) => setLabelStatus(v ?? LabelStatusEnum.ALL)}
					items={LabelStatusLabel}
				>
					<SelectTrigger className="w-36">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={LabelStatusEnum.ALL}>전체</SelectItem>
						<SelectItem value={LabelStatusEnum.UNLABELED}>미라벨</SelectItem>
						<SelectItem value={LabelStatusEnum.LABELED}>라벨완료</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-1">
				<Label>캡처 기간</Label>
				<Popover>
					<PopoverTrigger
						render={<Button variant="outline" />}
						className={cn(
							'w-64 justify-start text-left font-normal',
							!dateRange && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className="mr-2 size-4" />
						{formatRange(dateRange)}
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="range"
							selected={dateRange}
							onSelect={setDateRange}
							numberOfMonths={2}
							locale={ko}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<Button type="submit">검색</Button>
		</form>
	);
}

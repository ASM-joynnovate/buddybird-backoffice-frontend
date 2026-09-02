'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';

import { useRouter, useSearchParams } from 'next/navigation';

import { LabelCategoryTargetEnum } from '@/types/label';

import { useGetLabelList } from '@/hooks/apis/use-labels';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formatRange = (range?: DateRange) => {
	if (!range?.from) return '기간 선택';
	const f = (d: Date) => dayjs(d).format('YYYY.MM.DD');
	return range.to ? `${f(range.from)} - ${f(range.to)}` : f(range.from);
};

export default function CaptureFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: labels } = useGetLabelList();

	const captureLabels = labels.filter((c) => c.target === LabelCategoryTargetEnum.CAPTURE);

	const [selectedLabelOptionIds, setSelectedLabelOptionIds] = useState<string[]>(() =>
		searchParams.getAll('labelOptionIds'),
	);

	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		const from = searchParams.get('dateFrom');
		const to = searchParams.get('dateTo');
		return from || to ? { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined } : undefined;
	});

	const toggleLabelOption = (optionId: string) => {
		setSelectedLabelOptionIds((prev) =>
			prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
		);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();

		for (const [key, value] of formData.entries()) {
			if (typeof value === 'string' && value.trim()) {
				params.set(key, value.trim());
			}
		}

		for (const id of selectedLabelOptionIds) {
			params.append('labelOptionIds', id);
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
				<Label>클립 라벨</Label>
				<Popover>
					<PopoverTrigger
						render={<Button variant="outline" />}
						className={cn(
							'w-48 justify-between text-left font-normal',
							selectedLabelOptionIds.length === 0 && 'text-muted-foreground',
						)}
					>
						{selectedLabelOptionIds.length > 0 ? `${selectedLabelOptionIds.length}개 선택` : '라벨 선택'}
						<ChevronDownIcon className="ml-2 size-4 opacity-50" />
					</PopoverTrigger>
					<PopoverContent className="w-64 p-3" align="start">
						{captureLabels.length === 0 && (
							<p className="text-xs text-muted-foreground">클립 대상 라벨이 없습니다.</p>
						)}
						{captureLabels.map((category) => (
							<div key={category.id} className="mb-3 last:mb-0">
								<p className="mb-1.5 text-xs font-semibold text-muted-foreground">{category.name}</p>
								<div className="flex flex-wrap gap-1">
									{category.options.map((option) => {
										const selected = selectedLabelOptionIds.includes(option.id);
										return (
											<Badge
												key={option.id}
												variant={selected ? 'default' : 'outline'}
												className="cursor-pointer"
												render={<button type="button" />}
												aria-pressed={selected}
												onClick={() => toggleLabelOption(option.id)}
											>
												{option.name}
											</Badge>
										);
									})}
								</div>
							</div>
						))}
					</PopoverContent>
				</Popover>
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

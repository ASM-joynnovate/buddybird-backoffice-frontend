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
	const additionalFilterCount = ['firebaseAnonUid', 'deviceModel', 'devicePlatform', 'deviceOsVersion'].filter(
		(key) => searchParams.get(key),
	).length;

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

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
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
		<form
			onSubmit={handleSubmit}
			onReset={() => {
				setSelectedLabelOptionIds([]);
				setDateRange(undefined);
				router.push('/captures');
			}}
			className="shrink-0 space-y-4 rounded-lg border bg-card p-4"
		>
			<div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<div className="space-y-1">
					<Label htmlFor="wordLabel">단어명</Label>
					<Input
						id="wordLabel"
						name="wordLabel"
						defaultValue={searchParams.get('wordLabel') ?? ''}
						placeholder="단어명"
						className="w-full"
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="captureLabels">클립 라벨</Label>
					<Popover>
						<PopoverTrigger
							id="captureLabels"
							render={<Button type="button" variant="outline" />}
							className={cn(
								'w-full justify-between text-left font-normal',
								selectedLabelOptionIds.length === 0 && 'text-muted-foreground',
							)}
						>
							{selectedLabelOptionIds.length > 0
								? `${selectedLabelOptionIds.length}개 선택`
								: '라벨 선택'}
							<ChevronDownIcon className="ml-2 size-4 opacity-50" />
						</PopoverTrigger>
						<PopoverContent className="max-h-(--available-height) w-64 overflow-y-auto p-3" align="start">
							{captureLabels.length === 0 && (
								<p className="text-xs text-muted-foreground">클립 대상 라벨이 없습니다.</p>
							)}
							{captureLabels.map((category) => (
								<div key={category.id} className="mb-3 last:mb-0">
									<p className="mb-1.5 text-xs font-semibold text-muted-foreground">
										{category.name}
									</p>
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
					<Label htmlFor="captureDateRange">캡처 기간</Label>
					<Popover>
						<PopoverTrigger
							id="captureDateRange"
							render={<Button type="button" variant="outline" />}
							className={cn(
								'w-full justify-start text-left font-normal',
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
				<div className="space-y-1">
					<Label htmlFor="parrotSpecies">앵무새 종</Label>
					<Input
						id="parrotSpecies"
						name="parrotSpecies"
						defaultValue={searchParams.get('parrotSpecies') ?? ''}
						placeholder="예: 왕관앵무"
						maxLength={50}
					/>
				</div>
			</div>

			<details className="border-t pt-3">
				<summary
					className="w-fit cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-2
						focus-visible:outline-offset-4"
				>
					추가 필터{additionalFilterCount > 0 ? ` (${additionalFilterCount}개 적용)` : ''}
				</summary>
				<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
					<div className="space-y-1">
						<Label htmlFor="firebaseAnonUid">사용자 ID</Label>
						<Input
							id="firebaseAnonUid"
							name="firebaseAnonUid"
							defaultValue={searchParams.get('firebaseAnonUid') ?? ''}
							placeholder="Firebase UID"
							maxLength={128}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="deviceModel">기기 모델</Label>
						<Input
							id="deviceModel"
							name="deviceModel"
							defaultValue={searchParams.get('deviceModel') ?? ''}
							placeholder="예: iPhone 16"
							maxLength={30}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="devicePlatform">OS</Label>
						<Input
							id="devicePlatform"
							name="devicePlatform"
							defaultValue={searchParams.get('devicePlatform') ?? ''}
							placeholder="예: iOS"
							maxLength={10}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="deviceOsVersion">OS 버전</Label>
						<Input
							id="deviceOsVersion"
							name="deviceOsVersion"
							defaultValue={searchParams.get('deviceOsVersion') ?? ''}
							placeholder="예: 18.6"
							maxLength={20}
						/>
					</div>
				</div>
				<p className="mt-2 text-xs text-muted-foreground">
					기기 정보는 클립을 캡처한 기기 기준이며 완전일치로 검색합니다.
				</p>
			</details>
			<div className="flex justify-end gap-2 border-t pt-3">
				<Button type="reset" variant="outline">
					초기화
				</Button>
				<Button type="submit">검색</Button>
			</div>
		</form>
	);
}

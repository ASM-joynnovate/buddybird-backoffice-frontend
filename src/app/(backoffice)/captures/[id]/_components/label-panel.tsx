'use client';

import { useState } from 'react';

import { useCreateLabelCategory, useCreateLabelOption, useGetLabelList } from '@/hooks/apis/use-labels';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LabelPanel() {
	const [addingCategoryName, setAddingCategoryName] = useState('');
	const [addingOptionCategoryId, setAddingOptionCategoryId] = useState<string | null>(null);
	const [addingOptionName, setAddingOptionName] = useState('');

	const createCategory = useCreateLabelCategory();
	const createOption = useCreateLabelOption();

	const { data: labels } = useGetLabelList();

	const handleCreateCategory = () => {
		if (!addingCategoryName.trim()) return;
		createCategory.mutate(
			{ name: addingCategoryName.trim() },
			{
				onSuccess: () => setAddingCategoryName(''),
			},
		);
	};

	const handleCreateOption = (categoryId: string) => {
		if (!addingOptionName.trim()) return;
		createOption.mutate(
			{ categoryId, data: { name: addingOptionName.trim() } },
			{
				onSuccess: () => {
					setAddingOptionName('');
					setAddingOptionCategoryId(null);
				},
			},
		);
	};

	return (
		<div className="rounded-lg border bg-card">
			<div className="border-b px-4 py-3 text-sm font-semibold">라벨 관리</div>
			{labels.map((category) => (
				<div key={category.id} className="border-b px-4 py-3 last:border-b-0">
					<div
						className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider
							text-muted-foreground uppercase"
					>
						{category.name}
						<Button
							variant="ghost"
							size="icon-xs"
							onClick={() => {
								setAddingOptionCategoryId(addingOptionCategoryId === category.id ? null : category.id);
								setAddingOptionName('');
							}}
						>
							<PlusIcon className="size-3" />
						</Button>
					</div>
					<div className="flex flex-wrap gap-1">
						{category.options.map((option) => (
							<span key={option.id} className="rounded-full border px-2.5 py-0.5 text-xs">
								{option.name}
							</span>
						))}
					</div>
					{addingOptionCategoryId === category.id && (
						<div className="mt-2 flex gap-1">
							<Input
								value={addingOptionName}
								onChange={(e) => setAddingOptionName(e.target.value)}
								placeholder="옵션명"
								className="h-7 text-xs"
								onKeyDown={(e) => e.key === 'Enter' && handleCreateOption(category.id)}
								autoFocus
							/>
							<Button size="sm" onClick={() => handleCreateOption(category.id)}>
								추가
							</Button>
						</div>
					)}
				</div>
			))}
			<div className="px-4 py-3">
				<div className="flex gap-1">
					<Input
						value={addingCategoryName}
						onChange={(e) => setAddingCategoryName(e.target.value)}
						placeholder="카테고리 추가"
						className="h-7 text-xs"
						onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
					/>
					<Button size="sm" onClick={handleCreateCategory}>
						추가
					</Button>
				</div>
			</div>
		</div>
	);
}

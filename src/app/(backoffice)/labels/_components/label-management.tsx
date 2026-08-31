'use client';

import { useState } from 'react';

import { LabelCategoryTargetEnum, LabelCategoryTargetLabel } from '@/types/label';

import {
	useCreateLabelCategory,
	useCreateLabelOption,
	useDeleteLabelCategory,
	useDeleteLabelOption,
	useGetLabelList,
	useUpdateLabelCategory,
	useUpdateLabelOption,
} from '@/hooks/apis/use-labels';

import { PencilIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LabelManagement() {
	const { data: labels } = useGetLabelList();

	const createCategory = useCreateLabelCategory();
	const updateCategory = useUpdateLabelCategory();
	const deleteCategory = useDeleteLabelCategory();
	const createOption = useCreateLabelOption();
	const updateOption = useUpdateLabelOption();
	const deleteOption = useDeleteLabelOption();

	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryTarget, setNewCategoryTarget] = useState<LabelCategoryTargetEnum>(
		LabelCategoryTargetEnum.SEGMENT,
	);

	const [addingOptionCategoryId, setAddingOptionCategoryId] = useState<string | null>(null);
	const [newOptionName, setNewOptionName] = useState('');

	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
	const [editingCategoryName, setEditingCategoryName] = useState('');

	const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
	const [editingOptionName, setEditingOptionName] = useState('');

	const handleCreateCategory = () => {
		if (!newCategoryName.trim() || createCategory.isPending) return;
		createCategory.mutate(
			{ name: newCategoryName.trim(), target: newCategoryTarget },
			{
				onSuccess: () => setNewCategoryName(''),
				onError: () => toast.error('카테고리 생성에 실패했습니다.'),
			},
		);
	};

	const handleUpdateCategory = (categoryId: string) => {
		if (!editingCategoryName.trim() || updateCategory.isPending) return;
		updateCategory.mutate(
			{ categoryId, data: { name: editingCategoryName.trim() } },
			{
				onSuccess: () => setEditingCategoryId(null),
				onError: () => toast.error('카테고리 수정에 실패했습니다.'),
			},
		);
	};

	const handleCreateOption = (categoryId: string) => {
		if (!newOptionName.trim() || createOption.isPending) return;
		createOption.mutate(
			{ categoryId, data: { name: newOptionName.trim() } },
			{
				onSuccess: () => {
					setNewOptionName('');
					setAddingOptionCategoryId(null);
				},
				onError: () => toast.error('옵션 생성에 실패했습니다.'),
			},
		);
	};

	const handleUpdateOption = (optionId: string) => {
		if (!editingOptionName.trim() || updateOption.isPending) return;
		updateOption.mutate(
			{ optionId, data: { name: editingOptionName.trim() } },
			{
				onSuccess: () => setEditingOptionId(null),
				onError: () => toast.error('옵션 수정에 실패했습니다.'),
			},
		);
	};

	return (
		<div className="space-y-4">
			{labels.map((category) => (
				<div key={category.id} className="rounded-lg border bg-card">
					<div className="flex items-center gap-2 border-b px-4 py-3">
						{editingCategoryId === category.id ? (
							<div className="flex flex-1 gap-1">
								<Input
									value={editingCategoryName}
									onChange={(e) => setEditingCategoryName(e.target.value)}
									className="h-7 text-sm"
									onKeyDown={(e) =>
										e.key === 'Enter' &&
										!e.nativeEvent.isComposing &&
										handleUpdateCategory(category.id)
									}
									autoFocus
								/>
								<Button size="sm" onClick={() => handleUpdateCategory(category.id)}>
									저장
								</Button>
								<Button size="sm" variant="ghost" onClick={() => setEditingCategoryId(null)}>
									<XIcon className="size-3.5" />
								</Button>
							</div>
						) : (
							<>
								<span className="text-sm font-semibold">{category.name}</span>
								<Badge variant="secondary">{LabelCategoryTargetLabel[category.target]}</Badge>
								<div className="flex-1" />
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() => {
										setEditingCategoryId(category.id);
										setEditingCategoryName(category.name);
									}}
								>
									<PencilIcon className="size-3" />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									className="text-muted-foreground hover:text-destructive"
									onClick={() => {
										if (!confirm(`'${category.name}' 카테고리를 삭제하시겠습니까?`)) return;
										deleteCategory.mutate(category.id, {
											onError: () => toast.error('카테고리 삭제에 실패했습니다.'),
										});
									}}
								>
									<TrashIcon className="size-3" />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() => {
										setAddingOptionCategoryId(
											addingOptionCategoryId === category.id ? null : category.id,
										);
										setNewOptionName('');
									}}
								>
									<PlusIcon className="size-3" />
								</Button>
							</>
						)}
					</div>
					<div className="px-4 py-3">
						<div className="flex flex-wrap gap-1.5">
							{category.options.map((option) =>
								editingOptionId === option.id ? (
									<div key={option.id} className="flex gap-1">
										<Input
											value={editingOptionName}
											onChange={(e) => setEditingOptionName(e.target.value)}
											className="h-7 w-32 text-xs"
											onKeyDown={(e) =>
												e.key === 'Enter' &&
												!e.nativeEvent.isComposing &&
												handleUpdateOption(option.id)
											}
											autoFocus
										/>
										<Button size="sm" onClick={() => handleUpdateOption(option.id)}>
											저장
										</Button>
										<Button size="sm" variant="ghost" onClick={() => setEditingOptionId(null)}>
											<XIcon className="size-3.5" />
										</Button>
									</div>
								) : (
									<span
										key={option.id}
										className="group flex items-center gap-1 rounded-full border px-2.5 py-0.5
											text-xs"
									>
										{option.name}
										<button
											className="hidden text-muted-foreground group-hover:inline-flex
												hover:text-foreground"
											onClick={() => {
												setEditingOptionId(option.id);
												setEditingOptionName(option.name);
											}}
										>
											<PencilIcon className="size-2.5" />
										</button>
										<button
											className="hidden text-muted-foreground group-hover:inline-flex
												hover:text-destructive"
											onClick={() =>
												deleteOption.mutate(option.id, {
													onError: () => toast.error('옵션 삭제에 실패했습니다.'),
												})
											}
										>
											<XIcon className="size-2.5" />
										</button>
									</span>
								),
							)}
						</div>
						{addingOptionCategoryId === category.id && (
							<div className="mt-2 flex gap-1">
								<Input
									value={newOptionName}
									onChange={(e) => setNewOptionName(e.target.value)}
									placeholder="옵션명"
									className="h-7 w-48 text-xs"
									onKeyDown={(e) =>
										e.key === 'Enter' &&
										!e.nativeEvent.isComposing &&
										handleCreateOption(category.id)
									}
									autoFocus
								/>
								<Button size="sm" onClick={() => handleCreateOption(category.id)}>
									추가
								</Button>
							</div>
						)}
					</div>
				</div>
			))}

			<div className="rounded-lg border bg-card p-4">
				<p className="mb-2 text-sm font-semibold">카테고리 추가</p>
				<div className="flex gap-2">
					<Input
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						placeholder="카테고리명"
						className="h-8 w-48 text-sm"
						onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleCreateCategory()}
					/>
					<Select
						value={newCategoryTarget}
						onValueChange={(v) =>
							setNewCategoryTarget((v as LabelCategoryTargetEnum) ?? LabelCategoryTargetEnum.SEGMENT)
						}
						items={LabelCategoryTargetLabel}
					>
						<SelectTrigger className="h-8 w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={LabelCategoryTargetEnum.CAPTURE}>클립</SelectItem>
							<SelectItem value={LabelCategoryTargetEnum.SEGMENT}>세그먼트</SelectItem>
						</SelectContent>
					</Select>
					<Button size="sm" onClick={handleCreateCategory}>
						추가
					</Button>
				</div>
			</div>
		</div>
	);
}

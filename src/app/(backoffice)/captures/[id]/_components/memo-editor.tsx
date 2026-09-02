'use client';

import { useState } from 'react';

import { Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MemoEditorProps {
	memo: string | null;
	onSave: (memo: string) => void;
	isPending: boolean;
}

export default function MemoEditor({ memo, onSave, isPending }: MemoEditorProps) {
	const [value, setValue] = useState(memo ?? '');

	return (
		<div className="overflow-hidden rounded-lg border">
			<Textarea
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="메모 입력"
				className="h-20 resize-none overflow-scroll rounded-none border-none text-xs shadow-none
					focus-visible:ring-0"
				onClick={(e) => e.stopPropagation()}
			/>
			<div className="flex justify-end gap-1 border-t px-2 py-1.5">
				<Button
					variant="ghost"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						setValue(memo ?? '');
					}}
				>
					취소
				</Button>
				<Button
					size="sm"
					disabled={isPending}
					onClick={(e) => {
						e.stopPropagation();
						onSave(value);
					}}
				>
					{isPending && <Loader2Icon className="animate-spin" />}
					저장
				</Button>
			</div>
		</div>
	);
}

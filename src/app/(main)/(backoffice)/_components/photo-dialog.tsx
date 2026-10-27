'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Props {
	photoUrl?: string;
	title: string;
	className?: string;
	children: ReactNode;
}

/**
 * 누르면 사진을 크게 표시하는 컴포넌트
 * @param photoUrl 크게 표시할 사진 주소
 * @param title 다이얼로그 제목
 * @param className 누르는 영역의 모양을 정하는 class
 * @param children 누르는 영역에 표시할 작은 사진
 */
const PhotoDialog = ({ photoUrl, title, className, children }: Props) => {
	// 사진이 없으면 크게 보기 없음
	if (!photoUrl) {
		return children;
	}

	return (
		<Dialog>
			<DialogTrigger
				aria-label={`${title} 크게 보기`}
				className={cn(
					'shrink-0 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
					className,
				)}
			>
				{children}
			</DialogTrigger>

			<DialogContent className="p-5 sm:max-w-130">
				<DialogHeader>
					<DialogTitle className="font-bold">{title}</DialogTitle>
				</DialogHeader>

				<Image
					src={photoUrl}
					alt={title}
					width={480}
					height={480}
					unoptimized
					className="h-auto max-h-[calc(100dvh-8rem)] w-full rounded-lg object-contain"
				/>
			</DialogContent>
		</Dialog>
	);
};

export default PhotoDialog;

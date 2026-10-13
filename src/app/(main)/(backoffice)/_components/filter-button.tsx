'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { ListFilter } from 'lucide-react';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';

interface Props {
	filterCount?: number;
	size?: 'default' | 'sm';
	children: ReactNode;
}

/**
 * 필터 패널을 여닫는 버튼 컴포넌트
 * @param filterCount 버튼에 표시할 조건의 개수
 * @param size 버튼의 크기
 * @param children 버튼을 누르면 열리는 패널
 */
const FilterButton = ({ filterCount, size, children }: Props) => {
	const filterRef = useRef<HTMLDivElement>(null);

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);

	/** Esc 및 바깥 클릭으로 패널 닫기 */
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setFilterPanelOpen(false);
			}
		};
		const handlePointerDown = (event: PointerEvent) => {
			if (event.target instanceof Node && !filterRef.current?.contains(event.target)) {
				setFilterPanelOpen(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('pointerdown', handlePointerDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('pointerdown', handlePointerDown);
		};
	}, []);

	return (
		<div ref={filterRef} className="md:relative">
			<Button
				variant="outline"
				size={size}
				aria-expanded={filterPanelOpen}
				aria-controls="filter-panel"
				onClick={() => setFilterPanelOpen((prev) => !prev)}
			>
				<ListFilter />
				필터
				{!!filterCount && (
					<b className="grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1.5 text-xs font-bold text-card">
						{filterCount}
					</b>
				)}
			</Button>

			{filterPanelOpen && (
				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
					{children}
				</ErrorHandlingWrapper>
			)}
		</div>
	);
};

export default FilterButton;

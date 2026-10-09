'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import Form from 'next/form';
import Link from 'next/link';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import { ListFilter, Search, X } from 'lucide-react';

import { KEYWORD_MAX_LENGTH } from '@/config';
import { toLinkQuery } from '@/utils/search-params';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';

interface Props {
	pathname: string;
	placeholder: string;
	keyword?: string;
	query: Record<string, SearchParamValue>;
	selectedFilters: SelectedFilter[];
	filterCount?: number;
	filterPanel?: ReactNode;
	children?: ReactNode;
}

/**
 * 검색 및 필터 컴포넌트
 * @param pathname 검색하면 이동할 경로
 * @param placeholder 검색 입력의 안내 문구
 * @param keyword 조회 조건의 검색어
 * @param query 현재 주소의 쿼리
 * @param selectedFilters 칩으로 표시할 고른 조건
 * @param filterCount "필터" 버튼에 표시할 조건의 개수
 * @param filterPanel "필터" 버튼을 누르면 열리는 패널
 * @param children 칩 오른쪽에 표시할 내용
 */
const SearchBar = ({
	pathname,
	placeholder,
	keyword,
	query,
	selectedFilters,
	filterCount,
	filterPanel,
	children,
}: Props) => {
	const keywordInputRef = useRef<HTMLInputElement>(null);
	const filterRef = useRef<HTMLDivElement>(null);

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);

	/** "/" 키로 검색창 포커스, Esc 및 바깥 클릭으로 필터 닫기 */
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setFilterPanelOpen(false);
			}

			if (event.key !== '/' || event.target instanceof HTMLInputElement) {
				return;
			}

			event.preventDefault();
			keywordInputRef.current?.focus();
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

	const handleClearKeyword = () => {
		if (!keywordInputRef.current) {
			return;
		}

		keywordInputRef.current.value = '';
		keywordInputRef.current.focus();
		keywordInputRef.current.form?.requestSubmit();
	};

	return (
		<div
			// 목록 행 전환 중에도 위에 표시
			className="@container relative z-10 -mt-2 mb-2 flex flex-wrap items-center gap-2 bg-background py-2 [view-transition-name:search-bar] md:sticky md:top-0"
		>
			{/*검색어가 바뀌면 입력값을 새로 채움*/}
			<Form
				key={keyword}
				action={pathname}
				className="flex h-9 max-w-130 min-w-0 flex-[1_1_280px] items-center gap-2 rounded-md border bg-card pr-1 pl-3 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand hover:border-chart-neutral"
			>
				{Object.entries(toLinkQuery({ ...query, keyword: undefined })).map(([name, value]) => (
					<input key={name} type="hidden" name={name} value={String(value)} />
				))}

				<Search className="size-4.5 shrink-0" />
				<input
					ref={keywordInputRef}
					type="search"
					name="keyword"
					aria-label="검색어"
					placeholder={placeholder}
					autoComplete="off"
					defaultValue={keyword}
					maxLength={KEYWORD_MAX_LENGTH}
					className="peer h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="검색어 지우기"
					className="peer-placeholder-shown:hidden"
					onClick={handleClearKeyword}
				>
					<X className="size-3.5" />
				</Button>
				<kbd
					title="/ 키를 누르면 검색창으로 이동합니다"
					className="hidden h-5 min-w-5 place-items-center rounded-sm bg-muted px-1.5 font-sans text-xs font-semibold peer-placeholder-shown:grid"
				>
					/
				</kbd>
				<Button type="submit" size="sm">
					검색
				</Button>
			</Form>

			{/*좁은 화면에서는 검색줄 폭으로 패널 표시*/}
			{!!filterPanel && (
				<div ref={filterRef} className="md:relative">
					<Button
						variant="outline"
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
							{filterPanel}
						</ErrorHandlingWrapper>
					)}
				</div>
			)}

			{/*고른 조건, 누르면 그 조건을 지움*/}
			{selectedFilters.map((selectedFilter) => (
				<Link
					key={selectedFilter.name}
					href={{ pathname, query: toLinkQuery({ ...query, [selectedFilter.name]: undefined }) }}
					scroll={false}
					aria-label={`${selectedFilter.label} 조건 지우기`}
					className="inline-flex h-7 items-center gap-1.5 rounded-md bg-card pr-1.5 pl-2.5 text-[13px] font-semibold whitespace-nowrap ring-1 ring-border hover:bg-muted"
				>
					{!!selectedFilter.groupLabel && (
						<small className="text-[12.5px] font-medium text-muted-foreground">
							{selectedFilter.groupLabel}
						</small>
					)}
					{selectedFilter.icon}
					{selectedFilter.label}
					<X className="size-3.5 text-muted-foreground" />
				</Link>
			))}

			{children}
		</div>
	);
};

export default SearchBar;

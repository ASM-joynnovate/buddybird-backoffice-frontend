'use client';

import { useEffect, useRef, useState } from 'react';

import Form from 'next/form';
import Link from 'next/link';

import type { DashboardParams } from '@/types/apis/dashboard';
import { providerSchema } from '@/types/apis/users';

import type { SearchParamValue } from '@/lib/api';

import { ListFilter, Search, X } from 'lucide-react';

import ProviderIcon from '@/app/(main)/(backoffice)/_components/provider-icon';
import UserFilterPanel from '@/app/(main)/(backoffice)/users/_components/user-filter-panel';
import { USER_KEYWORD_MAX_LENGTH } from '@/config';
import { USER_FILTER_GROUPS, type UserFilters } from '@/config/user-filters';
import { toLinkQuery } from '@/utils/search-params';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';

interface Props {
	dashboardParams: DashboardParams;
	keyword?: string;
	userFilters: UserFilters;
	query: Record<string, SearchParamValue>;
}

/**
 * 사용자 검색 및 필터 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param keyword 조회 조건의 검색어
 * @param userFilters 필터에서 고른 값
 * @param query 현재 주소의 쿼리
 */
const UserSearchBar = ({ dashboardParams, keyword, userFilters, query }: Props) => {
	const keywordInputRef = useRef<HTMLInputElement>(null);
	const filterRef = useRef<HTMLDivElement>(null);

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);

	const selectedFilters = USER_FILTER_GROUPS.flatMap((filterGroup) => {
		const filterOption = filterGroup.options.find(({ value }) => value === userFilters[filterGroup.name]);

		return filterOption ? [{ filterGroup, filterOption }] : [];
	});
	const selectedCount = selectedFilters.length + Number(!!query.is_deleted);

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
		<div className="z-10 -mt-2 mb-2 flex flex-wrap items-center gap-2 bg-background py-2 md:sticky md:top-0">
			{/*검색어가 바뀌면 입력값을 새로 채움*/}
			<Form
				key={keyword}
				action="/users"
				className="flex h-9 max-w-130 flex-[1_1_280px] items-center gap-2 rounded-md border bg-card pr-1 pl-3 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand hover:border-chart-neutral"
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
					placeholder="닉네임, 이메일, 사용자 ID"
					autoComplete="off"
					defaultValue={keyword}
					maxLength={USER_KEYWORD_MAX_LENGTH}
					className="peer h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
				/>
				<button
					type="button"
					aria-label="검색어 지우기"
					className="grid size-6 place-items-center rounded-sm peer-placeholder-shown:hidden hover:bg-muted hover:text-foreground"
					onClick={handleClearKeyword}
				>
					<X className="size-3.5" />
				</button>
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

			<div ref={filterRef} className="relative">
				<Button
					variant="outline"
					aria-expanded={filterPanelOpen}
					aria-controls="user-filter-panel"
					onClick={() => setFilterPanelOpen((prev) => !prev)}
				>
					<ListFilter />
					필터
					{selectedCount > 0 && (
						<b className="grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1.5 text-xs font-bold text-card">
							{selectedCount}
						</b>
					)}
				</Button>

				{filterPanelOpen && (
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
						<UserFilterPanel
							dashboardParams={dashboardParams}
							userFilters={userFilters}
							selectedCount={selectedCount}
							query={query}
						/>
					</ErrorHandlingWrapper>
				)}
			</div>

			{/*고른 조건, 누르면 그 조건을 지움*/}
			{selectedFilters.map(({ filterGroup, filterOption }) => {
				const provider = providerSchema.safeParse(filterOption.value).data;

				return (
					<Link
						key={filterGroup.name}
						href={{ pathname: '/users', query: toLinkQuery({ ...query, [filterGroup.name]: undefined }) }}
						scroll={false}
						aria-label={`${filterOption.label} 조건 지우기`}
						className="inline-flex h-7 items-center gap-1.5 rounded-md bg-card pr-1.5 pl-2.5 text-[13px] font-semibold whitespace-nowrap ring-1 ring-border hover:bg-muted"
					>
						<small className="text-[12.5px] font-medium text-muted-foreground">{filterGroup.label}</small>
						{!!provider && <ProviderIcon provider={provider} className="size-4" />}
						{filterOption.label}
						<X className="size-3.5 text-muted-foreground" />
					</Link>
				);
			})}

			{!!query.is_deleted && (
				<Link
					href={{ pathname: '/users', query: toLinkQuery({ ...query, is_deleted: undefined }) }}
					scroll={false}
					aria-label="삭제됨 조건 지우기"
					className="inline-flex h-7 items-center gap-1.5 rounded-md bg-card pr-1.5 pl-2.5 text-[13px] font-semibold whitespace-nowrap ring-1 ring-border hover:bg-muted"
				>
					삭제됨
					<X className="size-3.5 text-muted-foreground" />
				</Link>
			)}
		</div>
	);
};

export default UserSearchBar;

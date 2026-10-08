'use client';

import { Fragment } from 'react';

import type { Consent } from '@/types/apis/consents';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import { Diff, Minus, Plus } from 'lucide-react';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { diffLines, type LineChange } from '@/utils/diff';

import { Badge } from '@/components/ui/badge';

const changedLinesClassName =
	'relative -mr-5 -ml-8 block pr-5 pl-8 no-underline before:absolute before:top-0 before:left-3.5 before:font-bold max-md:-mr-4 max-md:-ml-7 max-md:pr-4 max-md:pl-7 max-md:before:left-2.5';
const summaryTagClassName = 'gap-0.5 rounded-sm pl-1.5 font-bold tabular-nums';

interface Props {
	consent: Consent;
	previousConsent?: Consent;
	locale: keyof I18nFieldValue;
	compared: boolean;
	onLocaleChange: (locale: keyof I18nFieldValue) => void;
	onComparedChange: (compared: boolean) => void;
}

/**
 * 고지문 버전의 전문 및 이전 버전과의 비교 컴포넌트
 * @param consent 표시할 버전
 * @param previousConsent 바로 아래 버전
 * @param locale 표시할 언어
 * @param compared 이전 버전과 비교 여부
 * @param onLocaleChange 언어를 고르면 실행할 함수
 * @param onComparedChange 비교를 켜고 끄면 실행할 함수
 */
const ConsentBodyPane = ({ consent, previousConsent, locale, compared, onLocaleChange, onComparedChange }: Props) => {
	const body = consent.body[locale] ?? consent.body.en_us;
	const lineChanges: LineChange[] =
		compared && previousConsent
			? diffLines(previousConsent.body[locale] ?? previousConsent.body.en_us, body)
			: body.split('\n').map((text) => ({ type: 'same', text }));

	const addedLineCount = lineChanges.filter((lineChange) => lineChange.type === 'added').length;
	const removedLineCount = lineChanges.filter((lineChange) => lineChange.type === 'removed').length;
	const lineChangeSummary = `추가 ${addedLineCount}줄, 삭제 ${removedLineCount}줄`;

	// 이어진 추가 줄 및 삭제 줄은 한 묶음
	const lineGroups = lineChanges.reduce<{ type: LineChange['type']; texts: string[] }[]>((groups, lineChange) => {
		const lastGroup = groups.at(-1);

		if (lineChange.type !== 'same' && lastGroup?.type === lineChange.type) {
			lastGroup.texts.push(lineChange.text);
		} else {
			groups.push({ type: lineChange.type, texts: [lineChange.text] });
		}

		return groups;
	}, []);

	return (
		<div className="mt-4.5 overflow-hidden rounded-lg border">
			<div className="flex flex-wrap items-center gap-2 border-b bg-muted px-3 py-2 max-md:gap-1.5 max-md:px-2">
				<SegmentedControl
					label="언어"
					size="sm"
					options={[
						{ value: 'ko_kr', label: '한국어' },
						{ value: 'en_us', label: '영어' },
					]}
					value={locale}
					onValueChange={onLocaleChange}
				/>

				<div className="ml-auto flex items-center gap-2 max-md:gap-1.5">
					{compared && !!previousConsent && (
						<p title={lineChangeSummary} className="flex gap-1.5 max-md:gap-1">
							<span className="sr-only">{lineChangeSummary}</span>
							<Badge aria-hidden className={cn(summaryTagClassName, 'bg-success/10 text-success')}>
								<Plus strokeWidth={2.5} />
								{addedLineCount}
							</Badge>
							<Badge
								aria-hidden
								className={cn(summaryTagClassName, 'bg-destructive/10 text-destructive')}
							>
								<Minus strokeWidth={2.5} />
								{removedLineCount}
							</Badge>
						</p>
					)}

					{/*비교 버튼은 key를 고정*/}
					{!!previousConsent && (
						<div key="compare" className="relative">
							<button
								type="button"
								aria-label="이전 버전과 비교"
								aria-pressed={compared}
								className="peer grid size-7 place-items-center rounded-sm border bg-card transition-colors hover:border-chart-neutral hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-card"
								onClick={() => onComparedChange(!compared)}
							>
								<Diff className="size-4" />
							</button>
							<span
								aria-hidden
								className="pointer-events-none absolute top-[calc(100%+8px)] right-0 z-10 rounded-md bg-tooltip px-2.5 py-1.5 text-xs leading-[1.4] font-semibold whitespace-nowrap text-tooltip-foreground opacity-0 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] transition-opacity duration-120 peer-hover:opacity-100 peer-focus-visible:opacity-100"
							>
								이전 버전과 비교
							</span>
						</div>
					)}
				</div>
			</div>

			<article className="pt-4.5 pr-5 pb-5 pl-8 leading-[1.75] max-md:pr-4 max-md:pl-7">
				<h4 className="mb-3 text-lg leading-[1.4] font-bold tracking-[-0.01em]">
					{consent.title[locale] ?? consent.title.en_us}
				</h4>

				{lineGroups.map((lineGroup, groupIndex) => {
					const lines = lineGroup.texts.map((text, lineIndex) =>
						text ? (
							<p key={lineIndex} className="max-w-[68ch]">
								{text}
							</p>
						) : (
							<p key={lineIndex} className="h-3" />
						),
					);

					if (lineGroup.type === 'added') {
						return (
							<ins
								key={groupIndex}
								className={cn(
									changedLinesClassName,
									"bg-success/10 before:text-success before:content-['+']",
								)}
							>
								{lines}
							</ins>
						);
					}

					if (lineGroup.type === 'removed') {
						return (
							<del
								key={groupIndex}
								className={cn(
									changedLinesClassName,
									"bg-destructive/10 text-[color-mix(in_srgb,var(--destructive)_45%,var(--foreground))] before:text-destructive before:content-['−'] [&_p]:line-through",
								)}
							>
								{lines}
							</del>
						);
					}

					return <Fragment key={groupIndex}>{lines}</Fragment>;
				})}
			</article>
		</div>
	);
};

export default ConsentBodyPane;

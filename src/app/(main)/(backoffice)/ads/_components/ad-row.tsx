'use client';

import Image from 'next/image';

import type { Ad, AdStatsParams } from '@/types/apis/ads';

import { useUpdateAd } from '@/hooks/apis/ads';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import CountryFlagGroup from '@/app/(main)/(backoffice)/_components/country-flag-group';
import AdDetail from '@/app/(main)/(backoffice)/ads/_components/ad-detail';
import AdStatusIcon from '@/app/(main)/(backoffice)/ads/_components/ad-status-icon';
import { adCellClassName } from '@/app/(main)/(backoffice)/ads/_components/ad-table-header';
import { AD_KINDS } from '@/config/ad';
import { formatPeriod } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Switch } from '@/components/ui/switch';
import { TableCell, TableRow } from '@/components/ui/table';

const countCellClassName = cn(adCellClassName, 'text-right font-bold tabular-nums');

interface Props {
	ad: Ad;
	expanded: boolean;
	statsParams: AdStatsParams;
	period?: number;
	listQuery: Record<string, SearchParamValue>;
	today: string;
	onToggle: () => void;
	onEdit: () => void;
}

/**
 * 광고 표의 행 컴포넌트
 * @param ad 표시할 광고
 * @param expanded 상세 표시 여부
 * @param statsParams 통계 조회 조건
 * @param period 선택된 기간 버튼의 일수
 * @param listQuery 기간을 제외한 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param onToggle 행을 누르면 실행할 함수
 * @param onEdit "수정" 버튼을 누르면 실행할 함수
 */
const AdRow = ({ ad, expanded, statsParams, period, listQuery, today, onToggle, onEdit }: Props) => {
	const updateAd = useUpdateAd();

	const advertiserName = koreanOrEnglishText(ad.advertiser_name);
	const detailId = `ad-detail-${ad.id}`;
	const impressionCount = ad.event_counts.find((eventCount) => eventCount.kind === 'impression')?.count ?? 0;
	const clickCount = ad.event_counts.find((eventCount) => eventCount.kind === 'click')?.count ?? 0;
	// 저장이 끝날 때까지 변경한 값 표시
	const enabled = updateAd.isPending ? (updateAd.variables.data.is_enabled ?? ad.is_enabled) : ad.is_enabled;

	const handleEnabledChange = (checked: boolean) => {
		if (updateAd.isPending) {
			return;
		}

		updateAd.mutate({ id: ad.id, data: { is_enabled: checked } });
	};

	return (
		<>
			<TableRow className={cn('relative hover:bg-muted', expanded && 'bg-muted')}>
				<TableCell className={adCellClassName}>
					<Image
						src={ad.image_file.url}
						alt=""
						width={ad.kind === 'home_banner' ? 120 : 72}
						height={40}
						unoptimized
						className={cn(
							'rounded-sm object-cover ring-1 ring-border',
							ad.kind === 'home_banner' ? 'aspect-3/1 w-30' : 'aspect-video w-18',
						)}
					/>
				</TableCell>
				<TableCell className={adCellClassName}>
					<ColorTag color={AD_KINDS[ad.kind].color}>{AD_KINDS[ad.kind].label}</ColorTag>
				</TableCell>
				<TableCell className={adCellClassName}>
					<button
						type="button"
						aria-expanded={expanded}
						aria-controls={detailId}
						// 클릭 영역을 행 전체로 확장
						className="block max-w-full truncate text-left font-semibold after:absolute after:inset-0 focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand"
						onClick={onToggle}
					>
						{advertiserName}
					</button>
				</TableCell>
				<TableCell className={cn(adCellClassName, 'text-center')}>
					<AdStatusIcon status={ad.status} className="inline" />
				</TableCell>
				<TableCell className={cn(adCellClassName, 'text-[13px] text-muted-foreground tabular-nums')}>
					{formatPeriod(ad)}
				</TableCell>
				<TableCell className={adCellClassName}>
					{ad.countries.length > 0 ? (
						<CountryFlagGroup countries={ad.countries} />
					) : (
						<span className="text-muted-foreground">전체</span>
					)}
				</TableCell>
				<TableCell className={countCellClassName}>
					{/*가중치는 피드 광고에만 사용*/}
					{ad.kind === 'feed' ? ad.weight : <span className="font-normal text-muted-foreground">-</span>}
				</TableCell>
				<TableCell className={countCellClassName}>
					{impressionCount.toLocaleString('ko-KR')}
					<span className="ml-0.5 text-[13px] font-semibold text-muted-foreground">회</span>
				</TableCell>
				<TableCell className={countCellClassName}>
					{clickCount.toLocaleString('ko-KR')}
					<span className="ml-0.5 text-[13px] font-semibold text-muted-foreground">회</span>
				</TableCell>
				<TableCell className={cn(adCellClassName, 'text-center')}>
					{/*행 전체를 덮는 버튼보다 위에 배치*/}
					<Switch
						aria-label={`${advertiserName} 켜기`}
						checked={enabled}
						className="relative align-middle"
						onCheckedChange={handleEnabledChange}
					/>
				</TableCell>
			</TableRow>

			{expanded && (
				<TableRow className="hover:bg-transparent">
					<TableCell id={detailId} colSpan={10} className="border-b p-3">
						{/*가로로 스크롤해도 보이는 폭에 고정*/}
						<div className="sticky left-3 w-[calc(100cqw-24px)]">
							<AdDetail
								ad={ad}
								statsParams={statsParams}
								period={period}
								listQuery={listQuery}
								today={today}
								onEdit={onEdit}
							/>
						</div>
					</TableCell>
				</TableRow>
			)}
		</>
	);
};

export default AdRow;

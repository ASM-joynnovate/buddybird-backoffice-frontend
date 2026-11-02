import { cn } from '@/lib/utils';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const adTableClassName = 'w-full min-w-272.5 border-separate border-spacing-0 text-sm';
export const adCellClassName = 'h-16 border-r border-b px-3 last:border-r-0';

const headClassName = 'h-12 border-r border-b bg-card-inset px-3 text-muted-foreground last:border-r-0';

/** 광고 표의 머리 줄 컴포넌트 */
const AdTableHeader = () => {
	return (
		<TableHeader className="[&_tr]:border-0">
			<TableRow className="hover:bg-transparent">
				<TableHead className={cn(headClassName, 'w-38')}>사진</TableHead>
				<TableHead className={cn(headClassName, 'w-26')}>종류</TableHead>
				<TableHead className={headClassName}>광고주</TableHead>
				<TableHead className={cn(headClassName, 'w-16 text-center')}>상태</TableHead>
				<TableHead className={cn(headClassName, 'w-50')}>노출 기간</TableHead>
				<TableHead className={cn(headClassName, 'w-28')}>국가</TableHead>
				<TableHead className={cn(headClassName, 'w-18 text-right')}>가중치</TableHead>
				<TableHead className={cn(headClassName, 'w-26 text-right')}>노출 수</TableHead>
				<TableHead className={cn(headClassName, 'w-24 text-right')}>클릭 수</TableHead>
				<TableHead className={cn(headClassName, 'w-17 text-center')}>켜기</TableHead>
			</TableRow>
		</TableHeader>
	);
};

export default AdTableHeader;

import AdTableHeader, {
	adCellClassName,
	adTableClassName,
} from '@/app/(main)/(backoffice)/ads/_components/ad-table-header';

import { Card } from '@/components/ui/card';
import { SkeletonText } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const PLACEHOLDER_ROW_COUNT = 5;
const COLUMN_COUNT = 10;

/** 광고 표를 불러오는 동안 표시하는 컴포넌트 */
const AdTableSkeleton = () => {
	return (
		<Card className="gap-0 p-4">
			<div className="overflow-x-auto rounded-lg border">
				<table className={adTableClassName}>
					<AdTableHeader />

					<TableBody className="[&_tr:last-child>td]:border-b-0">
						{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, rowIndex) => (
							<TableRow key={rowIndex} className="hover:bg-transparent">
								{Array.from({ length: COLUMN_COUNT }, (_column, columnIndex) => (
									<TableCell key={columnIndex} className={adCellClassName}>
										<SkeletonText />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</table>
			</div>
		</Card>
	);
};

export default AdTableSkeleton;

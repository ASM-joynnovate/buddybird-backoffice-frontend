import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	title: string;
	rowCount: number;
}

/**
 * 제목이 있는 카드를 불러오는 동안 보이는 컴포넌트
 * @param title 카드 제목
 * @param rowCount 내용 자리에 표시할 행 수
 */
const TitledCardSkeleton = ({ title, rowCount }: Props) => {
	return (
		<TitledCard title={title}>
			<div className="space-y-3">
				{Array.from({ length: rowCount }, (_, index) => (
					<Skeleton key={index} className="h-5" />
				))}
			</div>
		</TitledCard>
	);
};

export default TitledCardSkeleton;

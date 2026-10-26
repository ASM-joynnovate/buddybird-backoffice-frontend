'use client';

import { useState } from 'react';

import type { Parrot } from '@/types/apis/users';

import { useGetUser } from '@/hooks/apis/users';

import { Pencil } from 'lucide-react';

import SpeciesIcon from '@/app/(main)/(backoffice)/_components/species-icon';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import ParrotFormDialog from '@/app/(main)/(backoffice)/users/[id]/_components/parrot-form-dialog';
import ParrotPhoto from '@/app/(main)/(backoffice)/users/_components/parrot-photo';
import { countAge } from '@/utils/date';
import { toSpeciesName } from '@/utils/species';

import { Button } from '@/components/ui/button';

interface Props {
	id: string;
	today: string;
}

/**
 * 앵무새 카드 컴포넌트
 * @param id 조회할 사용자 ID
 * @param today 오늘 날짜
 */
const ParrotCard = ({ id, today }: Props) => {
	const { data: userData } = useGetUser({ id });

	const [editingParrot, setEditingParrot] = useState<Parrot>();

	return (
		<TitledCard
			title="앵무새"
			action={
				userData.parrots.length > 0 && (
					<span className="text-[13px] text-muted-foreground">{userData.parrots.length}마리</span>
				)
			}
		>
			{userData.parrots.length === 0 && <p className="text-muted-foreground">등록한 앵무새가 없습니다.</p>}

			<ul className="divide-y">
				{userData.parrots.map((parrot) => (
					<li key={parrot.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
						<ParrotPhoto
							photoUrl={parrot.photo_file?.url}
							name={parrot.name}
							className="size-14 rounded-lg text-xl"
						/>

						<div className="min-w-0">
							<strong className="block text-base font-bold">{parrot.name}</strong>
							<span className="flex items-center gap-1.5 text-muted-foreground">
								<SpeciesIcon species={parrot.species} />
								{toSpeciesName(parrot.species)}
							</span>
						</div>

						{parrot.birthdate ? (
							<p className="ml-auto text-right whitespace-nowrap">
								<strong className="font-semibold">{countAge(parrot.birthdate, today)}살</strong>
								<span className="block text-[12.5px] text-muted-foreground tabular-nums">
									{parrot.birthdate}
								</span>
							</p>
						) : (
							<p className="ml-auto whitespace-nowrap text-muted-foreground">생일 입력 안 함</p>
						)}

						{!userData.is_deleted && (
							<Button
								variant="outline"
								size="icon-sm"
								aria-label={`${parrot.name} 수정`}
								title="수정"
								onClick={() => setEditingParrot(parrot)}
							>
								<Pencil />
							</Button>
						)}
					</li>
				))}
			</ul>

			{!!editingParrot && (
				<ParrotFormDialog
					userId={id}
					parrot={editingParrot}
					today={today}
					onClose={() => setEditingParrot(undefined)}
				/>
			)}
		</TitledCard>
	);
};

export default ParrotCard;

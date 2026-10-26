'use client';

import { type SubmitEvent, useState } from 'react';

import type { Parrot, UpdateParrotRequest } from '@/types/apis/users';

import { useDeleteUserParrotPhoto, useUpdateUserParrot } from '@/hooks/apis/users';

import CountedInput from '@/app/(main)/(backoffice)/_components/counted-input';
import SearchSelect from '@/app/(main)/(backoffice)/_components/search-select';
import RemovablePhotoField from '@/app/(main)/(backoffice)/users/[id]/_components/removable-photo-field';
import { PARROT_NAME_MAX_LENGTH } from '@/config';
import { SPECIES_IDS, toSpeciesName } from '@/utils/species';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const NAME_ERROR_ID = 'parrot-name-error';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:items-center @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

interface Props {
	userId: string;
	parrot: Parrot;
	today: string;
	onClose: () => void;
}

/**
 * 앵무새 수정 다이얼로그 컴포넌트
 * @param userId 앵무새를 등록한 사용자 ID
 * @param parrot 수정할 앵무새
 * @param today 오늘 날짜
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const ParrotFormDialog = ({ userId, parrot, today, onClose }: Props) => {
	const [photoRemoved, setPhotoRemoved] = useState(false);
	const [name, setName] = useState(parrot.name);
	const [species, setSpecies] = useState(parrot.species);
	const [birthdate, setBirthdate] = useState(parrot.birthdate ?? '');
	const [nameError, setNameError] = useState('');

	const updateUserParrot = useUpdateUserParrot();
	const deleteUserParrotPhoto = useDeleteUserParrotPhoto();

	const saving = updateUserParrot.isPending || deleteUserParrotPhoto.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleNameChange = (nextName: string) => {
		setName(nextName);
		setNameError('');
	};

	/** 사진 삭제를 선택했으면 삭제한 뒤 다이얼로그를 닫는 함수 */
	const deletePhotoAndClose = () => {
		if (!photoRemoved) {
			onClose();

			return;
		}

		deleteUserParrotPhoto.mutate({ id: userId, parrotId: parrot.id }, { onSuccess: onClose });
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const trimmedName = name.trim();

		if (!trimmedName) {
			setNameError('이름을 입력해 주세요.');

			return;
		}

		// 바뀐 값만 보냄
		const parrotUpdate: UpdateParrotRequest = {
			...(trimmedName !== parrot.name && { name: trimmedName }),
			...(species !== parrot.species && { species }),
			...((birthdate || null) !== parrot.birthdate && { birthdate: birthdate || null }),
		};

		if (Object.keys(parrotUpdate).length === 0) {
			deletePhotoAndClose();

			return;
		}

		// 사진 삭제는 앵무새 수정이 끝난 뒤 실행
		updateUserParrot.mutate(
			{ id: userId, parrotId: parrot.id, data: parrotUpdate },
			{ onSuccess: deletePhotoAndClose },
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-130">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">앵무새 수정</DialogTitle>
					</DialogHeader>

					<DialogBody className="@container grid gap-4.5 px-4 pt-5 pb-6 md:px-6">
						<div className={rowClassName}>
							<span className={labelClassName}>사진</span>
							<RemovablePhotoField
								photoFile={parrot.photo_file}
								removed={photoRemoved}
								square
								onRemovedChange={setPhotoRemoved}
							/>
						</div>

						<div className={rowClassName}>
							<label htmlFor="parrot-name" className={labelClassName}>
								이름
							</label>
							<div>
								<CountedInput
									id="parrot-name"
									autoComplete="off"
									maxLength={PARROT_NAME_MAX_LENGTH}
									value={name}
									aria-invalid={!!nameError}
									aria-describedby={nameError ? NAME_ERROR_ID : undefined}
									onChange={(event) => handleNameChange(event.target.value)}
								/>
								{!!nameError && (
									<p id={NAME_ERROR_ID} role="alert" className="mt-1.5 text-[13px] text-destructive">
										{nameError}
									</p>
								)}
							</div>
						</div>

						<div className={rowClassName}>
							<span className={labelClassName}>종</span>
							<SearchSelect
								label="종"
								value={species}
								options={SPECIES_IDS}
								placeholder="종 이름"
								customOptionAllowed
								toOptionLabel={toSpeciesName}
								onValueChange={setSpecies}
							/>
						</div>

						<div className={rowClassName}>
							<label htmlFor="parrot-birthdate" className={labelClassName}>
								생일
							</label>
							<div className="flex gap-2">
								<Input
									id="parrot-birthdate"
									type="date"
									max={today}
									value={birthdate}
									className="tabular-nums"
									onChange={(event) => setBirthdate(event.target.value)}
								/>
								<Button
									type="button"
									variant="outline"
									disabled={!birthdate}
									onClick={() => setBirthdate('')}
								>
									지우기
								</Button>
							</div>
						</div>
					</DialogBody>

					<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" loading={saving}>
							저장
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ParrotFormDialog;

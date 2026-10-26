'use client';

import { type SubmitEvent, useState } from 'react';

import { ApiError } from '@/types/apis/common';
import type { UpdateUserRequest, UserDetail } from '@/types/apis/users';

import { useDeleteUserPhoto, useUpdateUser } from '@/hooks/apis/users';

import CountedInput from '@/app/(main)/(backoffice)/_components/counted-input';
import SearchSelect from '@/app/(main)/(backoffice)/_components/search-select';
import RemovablePhotoField from '@/app/(main)/(backoffice)/users/[id]/_components/removable-photo-field';
import { NICKNAME_MAX_LENGTH } from '@/config';
import { COUNTRY_CODES } from '@/config/countries';
import { toCountryName } from '@/utils/country';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const NICKNAME_ERROR_ID = 'user-nickname-error';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:items-center @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

const countryOptions = COUNTRY_CODES.toSorted((a, b) => toCountryName(a).localeCompare(toCountryName(b), 'ko'));

interface Props {
	user: UserDetail;
	onClose: () => void;
}

/**
 * 사용자 프로필 수정 다이얼로그 컴포넌트
 * @param user 수정할 사용자
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const UserProfileFormDialog = ({ user, onClose }: Props) => {
	const [photoRemoved, setPhotoRemoved] = useState(false);
	const [nickname, setNickname] = useState(user.nickname ?? '');
	const [country, setCountry] = useState(user.country);
	const [nicknameError, setNicknameError] = useState('');

	const updateUser = useUpdateUser();
	const deleteUserPhoto = useDeleteUserPhoto();

	const saving = updateUser.isPending || deleteUserPhoto.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleNicknameChange = (nextNickname: string) => {
		setNickname(nextNickname);
		setNicknameError('');
	};

	/** 사진 삭제를 선택했으면 삭제한 뒤 다이얼로그를 닫는 함수 */
	const deletePhotoAndClose = () => {
		if (!photoRemoved) {
			onClose();

			return;
		}

		deleteUserPhoto.mutate({ id: user.id }, { onSuccess: onClose });
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const trimmedNickname = nickname.trim();
		// 바뀐 값만 보냄
		const userUpdate: UpdateUserRequest = {
			...(trimmedNickname !== (user.nickname ?? '') && { nickname: trimmedNickname || null }),
			...(!!country && country !== user.country && { country }),
		};

		if (Object.keys(userUpdate).length === 0) {
			deletePhotoAndClose();

			return;
		}

		// 사진 삭제는 프로필 수정이 끝난 뒤 실행
		updateUser.mutate(
			{ id: user.id, data: userUpdate },
			{
				onSuccess: deletePhotoAndClose,
				onError: (error) => {
					if (error instanceof ApiError && error.code === 'USER__DUPLICATE_NICKNAME') {
						setNicknameError(error.message);
					}
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-130">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">프로필 수정</DialogTitle>
					</DialogHeader>

					<DialogBody className="@container grid gap-4.5 px-4 pt-5 pb-6 md:px-6">
						<div className={rowClassName}>
							<span className={labelClassName}>사진</span>
							<RemovablePhotoField
								photoFile={user.photo_file}
								removed={photoRemoved}
								onRemovedChange={setPhotoRemoved}
							/>
						</div>

						<div className={rowClassName}>
							<label htmlFor="user-nickname" className={labelClassName}>
								닉네임
							</label>
							<div>
								<CountedInput
									id="user-nickname"
									autoComplete="off"
									placeholder="닉네임 없음"
									maxLength={NICKNAME_MAX_LENGTH}
									value={nickname}
									aria-invalid={!!nicknameError}
									aria-describedby={nicknameError ? NICKNAME_ERROR_ID : undefined}
									onChange={(event) => handleNicknameChange(event.target.value)}
								/>
								{!!nicknameError && (
									<p
										id={NICKNAME_ERROR_ID}
										role="alert"
										className="mt-1.5 text-[13px] text-destructive"
									>
										{nicknameError}
									</p>
								)}
							</div>
						</div>

						<div className={rowClassName}>
							<span className={labelClassName}>국가</span>
							<SearchSelect
								label="국가"
								value={country}
								options={countryOptions}
								placeholder="국가 이름 또는 코드"
								toOptionLabel={toCountryName}
								toOptionNote={(option) => option}
								onValueChange={setCountry}
							/>
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

export default UserProfileFormDialog;

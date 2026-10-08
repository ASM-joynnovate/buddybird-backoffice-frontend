'use client';

import { type RefObject, type SubmitEvent, useId, useState } from 'react';

import { useRouter } from 'next/navigation';

import { type AppUpdate, type Platform, platformSchema } from '@/types/apis/app-updates';

import type { I18nFieldValue } from '@/types/i18n';

import { useCreateAppUpdate, useGetAppUpdateList, useUpdateAppUpdate } from '@/hooks/apis/app-updates';
import { useGetAppUpdateDashboard } from '@/hooks/apis/dashboard';

import LocaleTextareaField from '@/app/(main)/(backoffice)/_components/locale-textarea-field';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import AppUpdatePreview from '@/app/(main)/(backoffice)/app-updates/_components/app-update-preview';
import DeviceCountChanges from '@/app/(main)/(backoffice)/app-updates/_components/device-count-changes';
import { APP_VERSION_MAX_LENGTH } from '@/config';
import { groupDevices, toVersionPolicy } from '@/utils/app-update';
import { englishTextMissing, toI18nFieldValue, toOptionalI18nText } from '@/utils/i18n-text';
import { toPlatformName } from '@/utils/platform';
import { isAppVersion } from '@/utils/version';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const VERSION_INPUT_ID = 'app-update-version';
const VERSION_ERROR_ID = 'app-update-version-error';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[84px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

interface Props {
	platform: Platform;
	appUpdate?: AppUpdate;
	versionInputRef: RefObject<HTMLInputElement | null>;
	onClose: () => void;
}

/**
 * 업데이트 입력 및 미리보기 컴포넌트
 * @param platform 화면에서 선택된 플랫폼
 * @param appUpdate 편집할 업데이트
 * @param versionInputRef 버전 입력의 ref
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const AppUpdateForm = ({ platform, appUpdate, versionInputRef, onClose }: Props) => {
	const router = useRouter();

	const [selectedPlatform, setSelectedPlatform] = useState(appUpdate?.platform ?? platform);
	const [version, setVersion] = useState(appUpdate?.version ?? '');
	const [versionBlurred, setVersionBlurred] = useState(false);
	const [saveTried, setSaveTried] = useState(false);
	const [forced, setForced] = useState(appUpdate?.is_forced ?? false);
	const [releaseNotes, setReleaseNotes] = useState(toI18nFieldValue(appUpdate?.release_notes ?? null));
	const [englishReleaseNotesMissing, setEnglishReleaseNotesMissing] = useState(false);

	const forcedLabelId = useId();

	const { data: appUpdateListData } = useGetAppUpdateList({ platform: selectedPlatform });
	const { data: appUpdateDashboardData } = useGetAppUpdateDashboard({ platform: selectedPlatform });

	const createAppUpdate = useCreateAppUpdate();
	const updateAppUpdate = useUpdateAppUpdate();

	const saving = createAppUpdate.isPending || updateAppUpdate.isPending;
	const trimmedVersion = version.trim();
	const versionValid = isAppVersion(trimmedVersion);
	const otherAppUpdates = appUpdateListData.filter((otherAppUpdate) => otherAppUpdate.id !== appUpdate?.id);
	const versionTaken = otherAppUpdates.some((otherAppUpdate) => otherAppUpdate.version === trimmedVersion);

	let versionError = '';

	if (!trimmedVersion) {
		versionError = saveTried ? '버전을 입력해 주세요.' : '';
	} else if (!versionValid) {
		versionError = saveTried || versionBlurred ? '1.2.0 형식으로 입력해 주세요.' : '';
	} else if (versionTaken) {
		versionError = '이미 등록된 버전입니다.';
	}

	// 입력값을 반영한 저장 뒤의 목록
	const savedAppUpdates = versionValid
		? [...otherAppUpdates, { version: trimmedVersion, is_forced: forced }]
		: appUpdateListData;
	const savedVersionPolicy = toVersionPolicy(savedAppUpdates);
	const savedDeviceGroups = groupDevices(appUpdateDashboardData.versions, savedVersionPolicy);
	const currentDeviceGroups = groupDevices(appUpdateDashboardData.versions, toVersionPolicy(appUpdateListData));

	const handleReleaseNotesChange = (nextReleaseNotes: I18nFieldValue) => {
		setReleaseNotes(nextReleaseNotes);
		setEnglishReleaseNotesMissing(false);
	};

	const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const nextEnglishReleaseNotesMissing = englishTextMissing(releaseNotes);

		setSaveTried(true);
		setEnglishReleaseNotesMissing(nextEnglishReleaseNotesMissing);

		if (!versionValid || versionTaken || nextEnglishReleaseNotesMissing) {
			return;
		}

		const appUpdateRequest = {
			version: trimmedVersion,
			is_forced: forced,
			release_notes: toOptionalI18nText(releaseNotes),
		};

		if (appUpdate) {
			updateAppUpdate.mutate({ id: appUpdate.id, data: appUpdateRequest }, { onSuccess: onClose });

			return;
		}

		createAppUpdate.mutate(
			{ data: { platform: selectedPlatform, ...appUpdateRequest } },
			{
				onSuccess: () => {
					onClose();

					// 추가한 플랫폼의 화면으로 이동
					if (selectedPlatform !== platform) {
						router.push(`/app-updates?platform=${selectedPlatform}`, { scroll: false });
					}
				},
			},
		);
	};

	return (
		<form onSubmit={handleSave}>
			<div className="grid md:min-h-140 md:grid-cols-[minmax(0,1fr)_380px]">
				<div className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
					<div className={`${rowClassName} items-center`}>
						<span className={labelClassName}>플랫폼</span>

						{/*등록한 뒤에는 플랫폼을 변경할 수 없음*/}
						{appUpdate ? (
							<p className="flex min-h-9 items-center gap-1.5 font-semibold">
								<PlatformIcon platform={appUpdate.platform} />
								{toPlatformName(appUpdate.platform)}
							</p>
						) : (
							<fieldset className="inline-flex h-9 w-fit rounded-md border bg-card p-0.5">
								<legend className="sr-only">플랫폼</legend>

								{platformSchema.options.map((platformOption) => (
									<label
										key={platformOption}
										className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground has-checked:bg-foreground has-checked:text-card has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
									>
										<input
											type="radio"
											name="platform"
											checked={selectedPlatform === platformOption}
											className="sr-only"
											onChange={() => setSelectedPlatform(platformOption)}
										/>
										<PlatformIcon
											platform={platformOption}
											selected={selectedPlatform === platformOption}
										/>
										{toPlatformName(platformOption)}
									</label>
								))}
							</fieldset>
						)}
					</div>

					<div className={rowClassName}>
						<label htmlFor={VERSION_INPUT_ID} className={`${labelClassName} @md:pt-2`}>
							버전
						</label>

						<div>
							<Input
								ref={versionInputRef}
								id={VERSION_INPUT_ID}
								autoComplete="off"
								placeholder="1.0.0"
								maxLength={APP_VERSION_MAX_LENGTH}
								value={version}
								aria-invalid={!!versionError}
								aria-describedby={versionError ? VERSION_ERROR_ID : undefined}
								className="w-40 font-bold tabular-nums"
								onChange={(event) => setVersion(event.target.value)}
								onBlur={() => setVersionBlurred(true)}
							/>
							{!!versionError && (
								<p id={VERSION_ERROR_ID} role="alert" className="mt-1.5 text-[13px] text-destructive">
									{versionError}
								</p>
							)}
						</div>
					</div>

					<div className={`${rowClassName} items-center`}>
						<span id={forcedLabelId} className={labelClassName}>
							강제 업데이트
						</span>

						<div className="flex min-h-9 items-center">
							<Switch aria-labelledby={forcedLabelId} checked={forced} onCheckedChange={setForced} />
						</div>
					</div>

					<div className={rowClassName}>
						<span className={`${labelClassName} @md:pt-2.5`}>기기</span>

						<DeviceCountChanges
							deviceGroups={savedDeviceGroups}
							currentDeviceGroups={currentDeviceGroups}
							minSupportedVersion={savedVersionPolicy.minSupportedVersion}
						/>
					</div>

					<div className={`${rowClassName} mt-2 border-t pt-5`}>
						<span className={`${labelClassName} @md:pt-2.5`}>
							출시 노트
							<span className="ml-1 text-xs font-normal">선택</span>
						</span>

						<div>
							<div className="grid gap-3 @md:grid-cols-2">
								<LocaleTextareaField
									locale="ko_kr"
									value={releaseNotes.ko_kr}
									placeholder="한 줄에 하나씩 입력"
									onValueChange={(ko_kr) => handleReleaseNotesChange({ ...releaseNotes, ko_kr })}
								/>
								<LocaleTextareaField
									locale="en_us"
									value={releaseNotes.en_us}
									placeholder="One change per line"
									invalid={englishReleaseNotesMissing}
									onValueChange={(en_us) => handleReleaseNotesChange({ ...releaseNotes, en_us })}
								/>
							</div>

							{englishReleaseNotesMissing && (
								<p role="alert" className="mt-1.5 text-[13px] text-destructive">
									영어 출시 노트를 입력해 주세요.
								</p>
							)}

							<p className="mt-2 text-[13px] text-muted-foreground">줄바꿈마다 문단 하나로 표시됩니다.</p>
						</div>
					</div>
				</div>

				<AppUpdatePreview
					version={trimmedVersion}
					forced={forced}
					releaseNotes={releaseNotes}
					latestVersion={savedVersionPolicy.latestVersion}
				/>
			</div>

			<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
				<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
					취소
				</Button>
				<Button type="submit" disabled={saving}>
					{appUpdate ? '저장' : '추가'}
				</Button>
			</DialogFooter>
		</form>
	);
};

export default AppUpdateForm;

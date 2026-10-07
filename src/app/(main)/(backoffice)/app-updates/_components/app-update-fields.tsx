'use client';

import { type SubmitEvent, useState } from 'react';

import type { AppUpdate, Platform } from '@/types/apis/app-updates';

import type { I18nFieldValue } from '@/types/i18n';

import { useSaveAppUpdate } from '@/hooks/apis/app-updates';

import { APP_VERSION_MAX_LENGTH } from '@/config';
import { englishTextMissing, toI18nFieldValue, toOptionalI18nText } from '@/utils/i18n-text';

import I18nField from '@/components/i18n-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	platform: Platform;
	appUpdate: AppUpdate | null;
}

/**
 * 앱 업데이트 정보 입력 컴포넌트
 * @param platform 정보를 저장할 플랫폼
 * @param appUpdate 저장된 앱 업데이트 정보
 */
const AppUpdateFields = ({ platform, appUpdate }: Props) => {
	const [latestVersion, setLatestVersion] = useState(appUpdate?.latest.version ?? '');
	const [minSupportedVersion, setMinSupportedVersion] = useState(appUpdate?.min_supported.version ?? '');
	const [releaseNotes, setReleaseNotes] = useState(toI18nFieldValue(appUpdate?.latest.release_notes ?? null));
	const [englishReleaseNotesMissing, setEnglishReleaseNotesMissing] = useState(false);

	const { isPending, mutate } = useSaveAppUpdate();

	const handleReleaseNotesChange = (nextReleaseNotes: I18nFieldValue) => {
		setReleaseNotes(nextReleaseNotes);
		setEnglishReleaseNotesMissing(false);
	};

	const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isPending) {
			return;
		}

		if (englishTextMissing(releaseNotes)) {
			setEnglishReleaseNotesMissing(true);

			return;
		}

		mutate({
			platform,
			data: {
				latest: { version: latestVersion, release_notes: toOptionalI18nText(releaseNotes) },
				min_supported: { version: minSupportedVersion },
			},
		});
	};

	return (
		<form onSubmit={handleSave} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor={`${platform}-latest-version`}>최신 버전</Label>
				<Input
					id={`${platform}-latest-version`}
					required
					maxLength={APP_VERSION_MAX_LENGTH}
					value={latestVersion}
					onChange={(event) => setLatestVersion(event.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor={`${platform}-min-supported-version`}>최소 지원 버전</Label>
				<Input
					id={`${platform}-min-supported-version`}
					required
					maxLength={APP_VERSION_MAX_LENGTH}
					value={minSupportedVersion}
					onChange={(event) => setMinSupportedVersion(event.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<I18nField legend="출시 노트" value={releaseNotes} multiline onValueChange={handleReleaseNotesChange} />
				{englishReleaseNotesMissing && (
					<p role="alert" className="text-sm text-destructive">
						영어 출시 노트를 입력해 주세요.
					</p>
				)}
			</div>

			<Button type="submit" disabled={isPending}>
				저장
			</Button>
		</form>
	);
};

export default AppUpdateFields;

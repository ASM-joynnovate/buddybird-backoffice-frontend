'use client';

import { type ReactNode, useState } from 'react';

import type { I18nFieldValue } from '@/types/i18n';

import AppDialogPreview from '@/app/(main)/(backoffice)/_components/app-dialog-preview';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { compareVersions, isAppVersion } from '@/utils/version';

// 문구는 앱의 업데이트 다이얼로그와 같음
const PREVIEW_LOCALES = [
	{
		locale: 'ko_kr',
		label: '한국어',
		closeLabel: '닫기',
		acceptLabel: '업데이트',
		optional: {
			title: '업데이트 알림',
			message: (version: ReactNode) => <>버디버드 {version} 버전을 사용할 수 있어요.</>,
		},
		forced: {
			title: '업데이트가 필요해요',
			message: (version: ReactNode) => <>계속 사용하려면 {version} 버전으로 업데이트해 주세요.</>,
		},
	},
	{
		locale: 'en_us',
		label: '영어',
		closeLabel: 'Close',
		acceptLabel: 'Update',
		optional: {
			title: 'Update available',
			message: (version: ReactNode) => <>BuddyBird {version} is available.</>,
		},
		forced: {
			title: 'Update needed',
			message: (version: ReactNode) => <>Update to {version} to keep using BuddyBird.</>,
		},
	},
] satisfies {
	locale: keyof I18nFieldValue;
	label: string;
	closeLabel: string;
	acceptLabel: string;
	optional: { title: string; message: (version: ReactNode) => ReactNode };
	forced: { title: string; message: (version: ReactNode) => ReactNode };
}[];

const HELP_TEXTS = {
	optional: '닫으면 같은 버전은 다시 표시하지 않습니다.',
	forced: '닫을 수 없으며 앱을 열 때마다 표시됩니다.',
	outdated: '최신 버전이 아니어서 앱에 표시되지 않습니다.',
};

interface Props {
	version: string;
	forced: boolean;
	releaseNotes: I18nFieldValue;
	latestVersion?: string;
}

/**
 * 앱에 표시되는 업데이트 다이얼로그의 미리보기 컴포넌트
 * @param version 앞뒤 공백을 지운 버전 입력값
 * @param forced 강제 업데이트 여부
 * @param releaseNotes 출시 노트 입력값
 * @param latestVersion 저장한 뒤의 최신 버전
 */
const AppUpdatePreview = ({ version, forced, releaseNotes, latestVersion }: Props) => {
	const [previewLocale, setPreviewLocale] = useState<keyof I18nFieldValue>('ko_kr');

	const localeTexts =
		PREVIEW_LOCALES.find((localeOption) => localeOption.locale === previewLocale) ?? PREVIEW_LOCALES[0];
	const updateTexts = forced ? localeTexts.forced : localeTexts.optional;
	const versionValid = isAppVersion(version);
	const outdated = versionValid && !!latestVersion && compareVersions(version, latestVersion) < 0;

	// 한국어가 비어 있으면 영어 출시 노트 표시
	const previewReleaseNotes = releaseNotes[previewLocale].trim() || releaseNotes.en_us.trim();
	const englishShown = previewLocale === 'ko_kr' && !releaseNotes.ko_kr.trim() && !!previewReleaseNotes;

	return (
		<aside className="grid content-start gap-3.5 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-bold">미리보기</h3>

				<SegmentedControl
					label="미리보기 언어"
					size="sm"
					options={PREVIEW_LOCALES.map((localeOption) => ({
						value: localeOption.locale,
						label: localeOption.label,
					}))}
					value={previewLocale}
					className="border-border"
					onValueChange={setPreviewLocale}
				/>
			</div>

			<div className="grid gap-2">
				{englishShown && (
					<span className="inline-flex h-5 items-center justify-self-start rounded-sm bg-muted px-2 text-xs font-bold text-muted-foreground">
						영어로 표시
					</span>
				)}

				<AppDialogPreview
					label="앱에 표시되는 업데이트 다이얼로그"
					title={updateTexts.title}
					closeLabel={forced ? undefined : localeTexts.closeLabel}
					acceptLabel={localeTexts.acceptLabel}
				>
					<div className="grid gap-6 text-[15px] leading-6 font-bold wrap-anywhere">
						<p className="text-[17px] leading-[27px]">
							{updateTexts.message(
								versionValid ? version : <span className="text-[#afafaf]">0.0.0</span>,
							)}
						</p>

						{/*줄마다 문단 하나로 표시*/}
						{!!previewReleaseNotes &&
							previewReleaseNotes.split('\n').map((line, index) => (
								<p key={`${index}-${line}`} className="min-h-6">
									{line}
								</p>
							))}
					</div>
				</AppDialogPreview>
			</div>

			<p className="text-[13px] text-muted-foreground">
				{outdated ? HELP_TEXTS.outdated : HELP_TEXTS[forced ? 'forced' : 'optional']}
			</p>
		</aside>
	);
};

export default AppUpdatePreview;

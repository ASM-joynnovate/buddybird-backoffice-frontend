import type { ReactNode } from 'react';

import type { I18nFieldValue } from '@/types/i18n';

import AppDialogPreview from '@/app/(main)/(backoffice)/_components/app-dialog-preview';
import { toI18nLocaleName } from '@/utils/i18n-text';
import { compareVersions, isAppVersion } from '@/utils/version';

interface UpdateTexts {
	title: string;
	message: (version: ReactNode) => ReactNode;
}

// 문구는 앱의 업데이트 다이얼로그와 같음
const DIALOG_TEXTS = {
	ko_kr: {
		closeLabel: '닫기',
		acceptLabel: '업데이트',
		optional: {
			title: '업데이트 알림',
			message: (version) => <>버디버드 {version} 버전을 사용할 수 있어요.</>,
		},
		forced: {
			title: '업데이트가 필요해요',
			message: (version) => <>계속 사용하려면 {version} 버전으로 업데이트해 주세요.</>,
		},
	},
	en_us: {
		closeLabel: 'Close',
		acceptLabel: 'Update',
		optional: {
			title: 'Update available',
			message: (version) => <>BuddyBird {version} is available.</>,
		},
		forced: {
			title: 'Update needed',
			message: (version) => <>Update to {version} to keep using BuddyBird.</>,
		},
	},
	ja_jp: {
		closeLabel: '閉じる',
		acceptLabel: 'アップデート',
		optional: {
			title: 'アップデートのお知らせ',
			message: (version) => <>BuddyBird {version} が利用できます。</>,
		},
		forced: {
			title: 'アップデートが必要です',
			message: (version) => <>引き続き使うには、バージョン{version}にアップデートしてください。</>,
		},
	},
	ru_ru: {
		closeLabel: 'Закрыть',
		acceptLabel: 'Обновить',
		optional: {
			title: 'Доступно обновление',
			message: (version) => <>Доступна версия BuddyBird {version}.</>,
		},
		forced: {
			title: 'Нужно обновление',
			message: (version) => <>Чтобы пользоваться приложением дальше, обнови его до версии {version}.</>,
		},
	},
	es_es: {
		closeLabel: 'Cerrar',
		acceptLabel: 'Actualizar',
		optional: {
			title: 'Actualización disponible',
			message: (version) => <>Ya está disponible BuddyBird {version}.</>,
		},
		forced: {
			title: 'Hace falta actualizar',
			message: (version) => <>Actualiza a la versión {version} para seguir usando la app.</>,
		},
	},
	th_th: {
		closeLabel: 'ปิด',
		acceptLabel: 'อัปเดต',
		optional: {
			title: 'มีอัปเดตใหม่',
			message: (version) => <>BuddyBird เวอร์ชัน {version} พร้อมให้ใช้งานแล้ว</>,
		},
		forced: {
			title: 'ต้องอัปเดตแอป',
			message: (version) => <>โปรดอัปเดตเป็นเวอร์ชัน {version} เพื่อใช้งานต่อ</>,
		},
	},
} satisfies Record<
	keyof I18nFieldValue,
	{ closeLabel: string; acceptLabel: string; optional: UpdateTexts; forced: UpdateTexts }
>;

const HELP_TEXTS = {
	optional: '닫으면 같은 버전은 다시 표시하지 않습니다.',
	forced: '닫을 수 없으며 앱을 열 때마다 표시됩니다.',
	outdated: '최신 버전이 아니어서 앱에 표시되지 않습니다.',
};

interface Props {
	version: string;
	forced: boolean;
	releaseNotes: I18nFieldValue;
	locale: keyof I18nFieldValue;
	latestVersion?: string;
}

/**
 * 앱에 표시되는 업데이트 다이얼로그의 미리보기 컴포넌트
 * @param version 앞뒤 공백을 지운 버전 입력값
 * @param forced 강제 업데이트 여부
 * @param releaseNotes 출시 노트 입력값
 * @param locale 미리보기에 표시할 언어
 * @param latestVersion 저장한 뒤의 최신 버전
 */
const AppUpdatePreview = ({ version, forced, releaseNotes, locale, latestVersion }: Props) => {
	const dialogTexts = DIALOG_TEXTS[locale];
	const updateTexts = forced ? dialogTexts.forced : dialogTexts.optional;
	const versionValid = isAppVersion(version);
	const outdated = versionValid && !!latestVersion && compareVersions(version, latestVersion) < 0;

	// 선택한 언어가 비어 있으면 영어 출시 노트 표시
	const previewReleaseNotes = releaseNotes[locale].trim() || releaseNotes.en_us.trim();
	const englishShown = locale !== 'en_us' && !releaseNotes[locale].trim() && !!previewReleaseNotes;

	return (
		<aside className="grid content-start gap-3.5 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
			<div className="flex min-h-7 items-center justify-between gap-2">
				<h3 className="text-base font-bold">미리보기</h3>
				<p className="text-[13px] text-muted-foreground">{toI18nLocaleName(locale)}</p>
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
					closeLabel={forced ? undefined : dialogTexts.closeLabel}
					acceptLabel={dialogTexts.acceptLabel}
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

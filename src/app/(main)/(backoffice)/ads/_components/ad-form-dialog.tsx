'use client';

import { type SubmitEvent, useId, useState } from 'react';

import { type Ad, type AdImageKind, type AdKind, adKindSchema } from '@/types/apis/ads';

import type { I18nFieldValue } from '@/types/i18n';

import { useCreateAd, useUpdateAd, useUploadAdImage } from '@/hooks/apis/ads';

import dayjs from 'dayjs';

import ColorInput from '@/app/(main)/(backoffice)/_components/color-input';
import CountryPicker from '@/app/(main)/(backoffice)/_components/country-picker';
import DateTimePicker from '@/app/(main)/(backoffice)/_components/date-time-picker';
import LocaleFieldGroup from '@/app/(main)/(backoffice)/_components/locale-field-group';
import RatioImageInput from '@/app/(main)/(backoffice)/_components/ratio-image-input';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import AdPreview from '@/app/(main)/(backoffice)/ads/_components/ad-preview';
import AdTextFields from '@/app/(main)/(backoffice)/ads/_components/ad-text-fields';
import DeleteAdDialog from '@/app/(main)/(backoffice)/ads/_components/delete-ad-dialog';
import {
	AD_IMAGE_NAMES,
	AD_IMAGE_SHAPES,
	AD_KINDS,
	AD_MAX_WEIGHT,
	AD_MIN_WEIGHT,
	AD_TEXT_FIELDS,
	AD_TEXT_NAMES,
	type AdTextName,
} from '@/config/ad';
import { I18N_LOCALES } from '@/config/locale';
import { toDateTimeInputValue, toTimestamp } from '@/utils/date';
import { englishTextMissing, toI18nFieldValue, toI18nText, toOptionalI18nText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const AUDIENCE_TARGETS = [
	{ target: 'all', label: '전체' },
	{ target: 'countries', label: '국가' },
] as const;

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

interface AdImageInput {
	url: string;
	fileId: string | null;
}

interface Props {
	ad?: Ad;
	onClose: () => void;
}

/**
 * 광고 작성 및 수정 다이얼로그 컴포넌트
 * @param ad 수정할 광고
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const AdFormDialog = ({ ad, onClose }: Props) => {
	const weightInputId = useId();

	const [kind, setKind] = useState<AdKind>(ad?.kind ?? 'home_banner');
	const [isAd, setIsAd] = useState(ad?.is_ad ?? true);
	const [isEnabled, setIsEnabled] = useState(ad?.is_enabled ?? true);

	const [startsAt, setStartsAt] = useState(ad ? toDateTimeInputValue(ad.starts_at) : '');
	const [endsAt, setEndsAt] = useState(ad?.ends_at ? toDateTimeInputValue(ad.ends_at) : '');
	const [endsAtInvalid, setEndsAtInvalid] = useState(false);

	const [target, setTarget] = useState<'all' | 'countries'>(ad?.countries.length ? 'countries' : 'all');
	const [countries, setCountries] = useState(ad?.countries ?? []);
	const [countriesMissing, setCountriesMissing] = useState(false);

	const [weight, setWeight] = useState(String(ad?.weight ?? AD_MIN_WEIGHT));

	const [locale, setLocale] = useState<keyof I18nFieldValue>('ko_kr');
	const [texts, setTexts] = useState<Record<AdTextName, I18nFieldValue>>({
		advertiser_name: toI18nFieldValue(ad?.advertiser_name ?? null),
		advertiser_description: toI18nFieldValue(ad?.advertiser_description ?? null),
		body: toI18nFieldValue(ad?.body ?? null),
		button_text: toI18nFieldValue(ad?.button_text ?? null),
		link_url: toI18nFieldValue(ad?.link_url ?? null),
	});
	const [textError, setTextError] = useState<{ textName: AdTextName; message: string } | null>(null);

	const [images, setImages] = useState<Partial<Record<AdImageKind, AdImageInput>>>(() =>
		ad
			? {
					[ad.kind]: { url: ad.image_file.url, fileId: ad.image_file.file_id },
					...(ad.advertiser_photo_file && {
						advertiser: { url: ad.advertiser_photo_file.url, fileId: ad.advertiser_photo_file.file_id },
					}),
				}
			: {},
	);

	const [buttonColor, setButtonColor] = useState(ad?.button_color ?? '');
	const [buttonTextColor, setButtonTextColor] = useState(ad?.button_text_color ?? '');

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const createAd = useCreateAd();
	const updateAd = useUpdateAd();
	const uploadAdImage = useUploadAdImage();

	const isFeed = kind === 'feed';
	const textNames = AD_TEXT_NAMES[kind];
	// 피드 광고만 광고주 사진 사용
	const imageKinds: AdImageKind[] = isFeed ? ['advertiser', 'feed'] : ['home_banner'];

	const saving = createAd.isPending || updateAd.isPending;
	const uploading = imageKinds.some((imageKind) => images[imageKind]?.fileId === null);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleTextChange = (textName: AdTextName, text: string) => {
		setTexts((prev) => ({ ...prev, [textName]: { ...prev[textName], [locale]: text } }));
		setTextError(null);
	};

	// 선택한 사진은 바로 업로드
	const handleImagePick = (imageKind: AdImageKind, file: File) => {
		const url = URL.createObjectURL(file);
		const previousImage = images[imageKind];

		setImages((prev) => ({ ...prev, [imageKind]: { url, fileId: null } }));

		uploadAdImage
			.mutateAsync({ file, kind: imageKind })
			.then((fileId) =>
				setImages((prev) => (prev[imageKind]?.url === url ? { ...prev, [imageKind]: { url, fileId } } : prev)),
			)
			.catch(() => {
				URL.revokeObjectURL(url);
				// 업로드하지 못하면 이전 사진 표시
				setImages((prev) => (prev[imageKind]?.url === url ? { ...prev, [imageKind]: previousImage } : prev));
			});
	};

	const handleTargetChange = (nextTarget: 'all' | 'countries') => {
		setTarget(nextTarget);
		setCountriesMissing(false);
	};

	const handleCountriesChange = (nextCountries: string[]) => {
		setCountries(nextCountries);
		setCountriesMissing(false);
	};

	const handleStartsAtChange = (value: string) => {
		setStartsAt(value);
		setEndsAtInvalid(false);
	};

	const handleEndsAtChange = (value: string) => {
		setEndsAt(value);
		setEndsAtInvalid(false);
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving || uploading) {
			return;
		}

		const englishMissingTextName = textNames.find((textName) =>
			AD_TEXT_FIELDS[textName].required ? !texts[textName].en_us.trim() : englishTextMissing(texts[textName]),
		);
		const invalidLinkLocale = I18N_LOCALES.find((localeOption) => {
			const link = texts.link_url[localeOption.locale].trim();

			return !!link && !/^https?:\/\//.test(link);
		})?.locale;
		const nextCountriesMissing = target === 'countries' && countries.length === 0;
		const nextEndsAtInvalid = !!endsAt && !dayjs(endsAt).isAfter(startsAt);
		const imageFileId = images[kind]?.fileId;

		setCountriesMissing(nextCountriesMissing);
		setEndsAtInvalid(nextEndsAtInvalid);

		// 오류가 있는 문구를 입력하도록 언어 선택
		if (englishMissingTextName) {
			setLocale('en_us');
			setTextError({ textName: englishMissingTextName, message: '영어 문구를 입력해 주세요.' });
		} else if (invalidLinkLocale) {
			setLocale(invalidLinkLocale);
			setTextError({ textName: 'link_url', message: '링크는 http:// 또는 https://로 시작해야 합니다.' });
		}

		if (englishMissingTextName || invalidLinkLocale || nextCountriesMissing || nextEndsAtInvalid || !imageFileId) {
			return;
		}

		const adRequest = {
			is_ad: isAd,
			is_enabled: isEnabled,
			starts_at: toTimestamp(startsAt),
			ends_at: endsAt ? toTimestamp(endsAt) : null,
			weight: Number(weight),
			// 빈 목록은 전체 대상
			countries: target === 'countries' ? countries : [],
			advertiser_name: toI18nText(texts.advertiser_name),
			advertiser_description: toOptionalI18nText(texts.advertiser_description),
			link_url: toI18nText(texts.link_url),
			image_file_id: imageFileId,
			// 홈 배너는 피드 광고 항목 없음
			advertiser_photo_file_id: isFeed ? (images.advertiser?.fileId ?? null) : null,
			body: isFeed ? toI18nText(texts.body) : null,
			button_text: isFeed ? toI18nText(texts.button_text) : null,
			button_color: isFeed ? buttonColor : null,
			button_text_color: isFeed ? buttonTextColor : null,
		};

		if (ad) {
			updateAd.mutate({ id: ad.id, data: adRequest }, { onSuccess: onClose });

			return;
		}

		createAd.mutate({ data: { ...adRequest, kind } }, { onSuccess: onClose });
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-280">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">
							{ad ? `${AD_KINDS[ad.kind].label} 수정` : '광고 작성'}
						</DialogTitle>
					</DialogHeader>

					<DialogBody className="grid md:min-h-140 md:grid-cols-[minmax(0,1fr)_420px]">
						<div className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
							{/*종류는 작성할 때만 선택*/}
							{!ad && (
								<div className={`${rowClassName} items-center`}>
									<span className={labelClassName}>종류</span>

									<SegmentedControl
										label="종류"
										options={adKindSchema.options.map((adKind) => ({
											value: adKind,
											label: AD_KINDS[adKind].label,
										}))}
										value={kind}
										onValueChange={setKind}
									/>
								</div>
							)}

							<div className={`${rowClassName} items-center`}>
								<span className={labelClassName}>광고</span>

								<Switch aria-label="광고" checked={isAd} onCheckedChange={setIsAd} />
							</div>

							<div className={`${rowClassName} items-center`}>
								<span className={labelClassName}>켜기</span>

								<Switch aria-label="켜기" checked={isEnabled} onCheckedChange={setIsEnabled} />
							</div>

							<div className={rowClassName}>
								<span className={`${labelClassName} @md:pt-2.5`}>노출 기간</span>

								<div>
									<div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
										<DateTimePicker
											value={startsAt}
											ariaLabel="노출 시작"
											required
											onValueChange={handleStartsAtChange}
										/>
										~
										<DateTimePicker
											value={endsAt}
											ariaLabel="노출 종료"
											invalid={endsAtInvalid}
											onValueChange={handleEndsAtChange}
										/>
									</div>

									{endsAtInvalid && (
										<p role="alert" className="mt-1.5 text-[13px] text-destructive">
											노출 종료는 노출 시작보다 늦어야 합니다.
										</p>
									)}
								</div>
							</div>

							<div className={rowClassName}>
								<span className={`${labelClassName} @md:pt-2`}>국가</span>

								<div className="grid min-w-0 justify-items-start gap-2">
									<SegmentedControl
										label="국가"
										options={AUDIENCE_TARGETS.map((audienceTarget) => ({
											value: audienceTarget.target,
											label: audienceTarget.label,
										}))}
										value={target}
										onValueChange={handleTargetChange}
									/>

									{target === 'countries' && (
										<CountryPicker
											countries={countries}
											onCountriesChange={handleCountriesChange}
										/>
									)}

									{countriesMissing && (
										<p role="alert" className="text-[13px] text-destructive">
											대상 국가를 선택해 주세요.
										</p>
									)}
								</div>
							</div>

							{/*가중치는 피드 광고 선택 비율*/}
							{isFeed && (
								<div className={`${rowClassName} items-center`}>
									<label htmlFor={weightInputId} className={labelClassName}>
										가중치
									</label>

									<Input
										id={weightInputId}
										type="number"
										min={AD_MIN_WEIGHT}
										max={AD_MAX_WEIGHT}
										required
										value={weight}
										className="w-20 tabular-nums"
										onChange={(event) => setWeight(event.target.value)}
									/>
								</div>
							)}

							<div className={`${rowClassName} mt-2 border-t pt-5`}>
								<span className={`${labelClassName} @md:pt-2.5`}>문구</span>

								<div>
									<LocaleFieldGroup
										locale={locale}
										summaryTexts={texts.advertiser_name}
										englishRequired
										onLocaleChange={setLocale}
									>
										<AdTextFields
											locale={locale}
											textNames={textNames}
											texts={texts}
											invalidTextName={textError?.textName}
											onTextChange={handleTextChange}
										/>
									</LocaleFieldGroup>

									{!!textError && (
										<p role="alert" className="mt-1.5 text-[13px] text-destructive">
											{textError.message}
										</p>
									)}
								</div>
							</div>

							<div className={`${rowClassName} mt-2 border-t pt-5`}>
								<span className={`${labelClassName} @md:pt-2.5`}>사진</span>

								<div className="flex flex-wrap items-start gap-5">
									{imageKinds.map((imageKind) => (
										<RatioImageInput
											key={imageKind}
											label={`${AD_IMAGE_NAMES[imageKind]} 사진`}
											name={isFeed ? AD_IMAGE_NAMES[imageKind] : undefined}
											imageUrl={images[imageKind]?.url}
											uploading={images[imageKind]?.fileId === null}
											{...AD_IMAGE_SHAPES[imageKind]}
											onImagePick={(file) => handleImagePick(imageKind, file)}
										/>
									))}
								</div>
							</div>

							{isFeed && (
								<div className={`${rowClassName} items-center`}>
									<span className={labelClassName}>버튼 색</span>

									<div className="flex flex-wrap items-center gap-2">
										<ColorInput
											label="배경"
											ariaLabel="버튼 배경색"
											value={buttonColor}
											required
											onValueChange={setButtonColor}
										/>
										<ColorInput
											label="글자"
											ariaLabel="버튼 글자색"
											value={buttonTextColor}
											required
											onValueChange={setButtonTextColor}
										/>
									</div>
								</div>
							)}
						</div>

						<AdPreview
							kind={kind}
							isAd={isAd}
							locale={locale}
							texts={texts}
							imageUrl={images[kind]?.url}
							advertiserPhotoUrl={images.advertiser?.url}
							buttonColor={buttonColor}
							buttonTextColor={buttonTextColor}
						/>
					</DialogBody>

					<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
						{!!ad && (
							<Button
								type="button"
								variant="destructive"
								className="sm:mr-auto"
								disabled={saving}
								onClick={() => setDeleteDialogOpen(true)}
							>
								삭제
							</Button>
						)}
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						{/*사진 업로드 완료 뒤 저장 가능*/}
						<Button type="submit" loading={saving} disabled={uploading}>
							저장
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			{!!ad && (
				<DeleteAdDialog
					open={deleteDialogOpen}
					ad={ad}
					onClose={() => setDeleteDialogOpen(false)}
					onDelete={onClose}
				/>
			)}
		</Dialog>
	);
};

export default AdFormDialog;

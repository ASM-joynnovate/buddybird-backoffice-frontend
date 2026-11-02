import Image from 'next/image';

import type { AdKind } from '@/types/apis/ads';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import { ChevronRight } from 'lucide-react';

import type { AdTextName } from '@/config/ad';
import { toI18nLocaleName } from '@/utils/i18n-text';

interface Props {
	kind: AdKind;
	isAd: boolean;
	locale: keyof I18nFieldValue;
	texts: Record<AdTextName, I18nFieldValue>;
	imageUrl?: string;
	advertiserPhotoUrl?: string;
	buttonColor: string;
	buttonTextColor: string;
}

/**
 * 앱에 표시되는 광고의 미리보기 컴포넌트
 * @param kind 광고 종류
 * @param isAd AD 표시 여부
 * @param locale 미리보기에 표시할 언어
 * @param texts 문구마다 언어별 입력값
 * @param imageUrl 배너 또는 피드 사진의 주소
 * @param advertiserPhotoUrl 광고주 사진의 주소
 * @param buttonColor 버튼 배경색
 * @param buttonTextColor 버튼 글자색
 */
const AdPreview = ({
	kind,
	isAd,
	locale,
	texts,
	imageUrl,
	advertiserPhotoUrl,
	buttonColor,
	buttonTextColor,
}: Props) => {
	// 선택한 언어가 비어 있으면 영어 문구 표시
	const advertiserName = texts.advertiser_name[locale].trim() || texts.advertiser_name.en_us.trim();
	const advertiserDescription =
		texts.advertiser_description[locale].trim() || texts.advertiser_description.en_us.trim();
	const body = texts.body[locale].trim() || texts.body.en_us.trim();
	const buttonText = texts.button_text[locale].trim() || texts.button_text.en_us.trim();

	return (
		<aside className="grid content-start gap-3.5 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5">
			<div className="flex min-h-7 items-center justify-between gap-2">
				<h3 className="text-base font-bold">미리보기</h3>
				<p className="text-[13px] text-muted-foreground">{toI18nLocaleName(locale)}</p>
			</div>

			<section className="grid gap-1.5">
				<h4 className="text-[13px] font-semibold text-muted-foreground">
					{kind === 'home_banner' ? '앱 홈 배너' : '앱 피드'}
				</h4>

				{/*앱에는 어두운 화면이 없어 색을 고정*/}
				<div className="w-full max-w-90 justify-self-center rounded-3xl bg-[#ececec] p-4 text-[#3c3c3c]">
					{kind === 'home_banner' ? (
						<div
							aria-label="앱 홈 화면에 표시되는 배너"
							className="relative aspect-3/1 overflow-hidden rounded-[18px] bg-[#f7f7f7]"
						>
							{!!imageUrl && (
								<Image
									src={imageUrl}
									alt=""
									width={328}
									height={109}
									unoptimized
									className="size-full object-cover"
								/>
							)}

							{isAd && (
								<span className="absolute top-2 right-2 rounded-[4px] bg-[#00000066] px-1 text-[10px] leading-[15px] font-extrabold tracking-[0.04em] text-white">
									AD
								</span>
							)}
						</div>
					) : (
						<article
							aria-label="앱 피드에 표시되는 광고"
							className="overflow-hidden rounded-[18px] border-2 border-[#e5e5e5] bg-white px-4 pt-4"
						>
							<div className="flex items-center gap-2.5">
								<span className="size-10 shrink-0 overflow-hidden rounded-full bg-[#f7f7f7]">
									{!!advertiserPhotoUrl && (
										<Image
											src={advertiserPhotoUrl}
											alt=""
											width={40}
											height={40}
											unoptimized
											className="size-full object-cover"
										/>
									)}
								</span>

								<div className="grid min-w-0 flex-1">
									<b
										className={cn(
											'truncate text-[15px] leading-5 font-black',
											!advertiserName && 'font-normal text-[#777]',
										)}
									>
										{advertiserName || '광고주 이름'}
									</b>
									{!!advertiserDescription && (
										<small className="mt-px truncate text-[13px] leading-[17px] font-extrabold text-[#afafaf]">
											{advertiserDescription}
										</small>
									)}
								</div>

								{isAd && (
									<span className="flex h-[15px] shrink-0 items-center rounded-[4px] border border-[#e5e5e5] px-1 text-[10px] font-extrabold tracking-[0.04em] text-[#afafaf]">
										AD
									</span>
								)}
							</div>

							<p
								className={cn(
									'mt-3 text-base leading-6 wrap-anywhere whitespace-pre-line',
									!body && 'text-[#777]',
								)}
							>
								{body || '본문'}
							</p>

							<div className="-mx-4 mt-3">
								<div className="aspect-video bg-[#f7f7f7]">
									{!!imageUrl && (
										<Image
											src={imageUrl}
											alt=""
											width={328}
											height={185}
											unoptimized
											className="size-full object-cover"
										/>
									)}
								</div>

								<div
									className="flex h-12 items-center justify-between gap-2 pr-3 pl-4 text-[15px] font-extrabold"
									style={{ backgroundColor: buttonColor, color: buttonTextColor }}
								>
									<span className="truncate">{buttonText || '버튼 문구'}</span>
									<ChevronRight className="size-5 shrink-0" />
								</div>
							</div>
						</article>
					)}
				</div>
			</section>
		</aside>
	);
};

export default AdPreview;

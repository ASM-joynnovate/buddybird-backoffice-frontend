'use client';

import { type ComponentRef, useEffect, useRef } from 'react';

import type { UserDashboard } from '@/types/apis/dashboard';

import useResolvedTheme from '@/hooks/use-resolved-theme';

import { COUNTRY_POSITIONS } from '@/config/country-positions';
import { toCountryName } from '@/utils/country';

import { Map, MapControls, MapGeoJSON, MapMarker, MarkerContent, MarkerTooltip } from '@/components/ui/map';

// Natural Earth 110m 국가 경계, 속성은 국가 코드 country
const COUNTRY_SHAPES_URL = '/maps/countries.geojson';

// WebGL은 CSS 변수를 읽지 못해 화면 모드별 색을 직접 지정
const MAP_COLORS = {
	light: { land: '#e8e7e1', border: '#ffffff', activeLand: '#c5d9fb' },
	dark: { land: '#33332f', border: '#1f1f1d', activeLand: '#2c4270' },
};

interface Props {
	countries: UserDashboard['countries'];
}

/**
 * 국가별 접속 사용자 지도 컴포넌트
 * @param countries 접속 사용자가 많은 순서의 국가 목록
 */
const CountryMap = ({ countries }: Props) => {
	const mapAreaRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<ComponentRef<typeof Map>>(null);

	const theme = useResolvedTheme();

	const mapColors = MAP_COLORS[theme];
	const maxCount = Math.max(1, ...countries.map(({ count }) => count));
	// 목록 순서대로 그려 사용자가 적은 국가의 원이 위에 놓임
	const countryMarkers = countries.flatMap(({ country, count }) => {
		const countryPosition = country ? COUNTRY_POSITIONS[country] : undefined;

		return country && countryPosition
			? [{ country, count, longitude: countryPosition[0], latitude: countryPosition[1] }]
			: [];
	});

	/** Ctrl + 스크롤 및 트랙패드로 지도를 확대하거나 이동 */
	useEffect(() => {
		const mapArea = mapAreaRef.current;

		if (!mapArea) {
			return;
		}

		const handleWheel = (event: WheelEvent & { wheelDeltaY?: number }) => {
			const map = mapRef.current;
			const zooming = event.ctrlKey || event.metaKey;
			// 마우스 휠은 가로 값이 없고 세로 값이 120의 배수
			const trackpadUsed = event.deltaX !== 0 || Math.abs(event.wheelDeltaY ?? 0) % 120 !== 0;

			// Ctrl 없는 마우스 휠은 페이지 스크롤
			if (!map || (!zooming && !trackpadUsed)) {
				return;
			}

			event.preventDefault();

			if (zooming) {
				const mapAreaRect = mapArea.getBoundingClientRect();
				const zoomChange = Math.max(-0.5, Math.min(0.5, -event.deltaY * 0.01));

				map.zoomTo(map.getZoom() + zoomChange, {
					around: map.unproject([event.clientX - mapAreaRect.left, event.clientY - mapAreaRect.top]),
					duration: 0,
				});

				return;
			}

			map.panBy([event.deltaX, event.deltaY], { duration: 0 });
		};

		mapArea.addEventListener('wheel', handleWheel, { passive: false });

		return () => mapArea.removeEventListener('wheel', handleWheel);
	}, []);

	return (
		<div
			ref={mapAreaRef}
			className="relative isolate h-75 overflow-hidden rounded-lg bg-card ring-1 ring-border ring-inset max-md:h-55"
		>
			<Map
				ref={mapRef}
				blank
				bounds={[
					[-168, -52],
					[178, 74],
				]}
				fitBoundsOptions={{ padding: 6 }}
				maxZoom={4}
				scrollZoom={false}
				dragRotate={false}
				pitchWithRotate={false}
				touchPitch={false}
				attributionControl={false}
			>
				{/*접속 사용자가 있는 국가는 다른 색으로 칠함*/}
				<MapGeoJSON
					data={COUNTRY_SHAPES_URL}
					fillPaint={{
						'fill-color': [
							'case',
							['in', ['get', 'country'], ['literal', countryMarkers.map(({ country }) => country)]],
							mapColors.activeLand,
							mapColors.land,
						],
					}}
					linePaint={{ 'line-color': mapColors.border, 'line-width': 0.6 }}
				/>

				{countryMarkers.map((countryMarker) => {
					const markerSizePx = Math.round(10 + Math.sqrt(countryMarker.count / maxCount) * 38);
					const countryName = toCountryName(countryMarker.country);

					return (
						<MapMarker
							key={countryMarker.country}
							longitude={countryMarker.longitude}
							latitude={countryMarker.latitude}
						>
							<MarkerContent>
								<button
									type="button"
									aria-label={`${countryName} ${countryMarker.count.toLocaleString('ko-KR')}명`}
									className="block rounded-full bg-chart-2/76 ring-[1.5px] ring-card transition-[scale,background-color] hover:scale-112 hover:bg-chart-2 focus-visible:scale-112 focus-visible:bg-chart-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none"
									style={{ width: markerSizePx, height: markerSizePx }}
								/>
							</MarkerContent>

							<MarkerTooltip
								offset={markerSizePx / 2 + 8}
								className="rounded-lg bg-tooltip px-3 py-2 text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]"
							>
								<strong className="block text-[13px] font-bold tabular-nums">
									{countryMarker.count.toLocaleString('ko-KR')}명
								</strong>
								<span className="text-tooltip-foreground/75">{countryName}</span>
							</MarkerTooltip>
						</MapMarker>
					);
				})}

				<MapControls className="right-2 bottom-2" />
			</Map>
		</div>
	);
};

export default CountryMap;

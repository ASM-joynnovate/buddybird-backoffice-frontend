import { COUNTRY_CODES } from '../src/config/countries.ts';
import { SPECIES_IDS } from '../src/utils/species.ts';
import { SPRITE_COLUMN_COUNT } from '../src/utils/sprite.ts';
import path from 'node:path';
import sharp from 'sharp';

// 아이콘 이미지 생성 스크립트
// node scripts/build-icon-sprites.mjs <모바일 assets/images>
const sourceDir = process.argv[2];

/** 아이콘 이미지 저장 함수 */
const buildSprite = async (files, width, height, output) => {
	const tiles = await Promise.all(
		files.map(async (file, index) => ({
			input: await sharp(file).resize(width, height).toBuffer(),
			left: (index % SPRITE_COLUMN_COUNT) * width,
			top: Math.floor(index / SPRITE_COLUMN_COUNT) * height,
		})),
	);

	await sharp({
		create: {
			width: SPRITE_COLUMN_COUNT * width,
			height: Math.ceil(files.length / SPRITE_COLUMN_COUNT) * height,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.composite(tiles)
		.png({ palette: true, quality: 95 })
		.toFile(output);
};

// 화면 크기의 2배로 저장
await buildSprite(
	COUNTRY_CODES.map((country) => path.join(sourceDir, 'flags', `${country.toLowerCase()}.svg`)),
	40,
	30,
	'public/images/flags.png',
);
await buildSprite(
	SPECIES_IDS.map((species) => path.join(sourceDir, 'species', `${species}.webp`)),
	40,
	40,
	'public/images/species.png',
);

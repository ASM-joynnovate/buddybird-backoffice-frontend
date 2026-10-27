export const SPRITE_COLUMN_COUNT = 16;

/** 아이콘 위치 style 계산 함수 */
export const toSpriteStyle = (src: string, index: number, count: number) => {
	const rowCount = Math.ceil(count / SPRITE_COLUMN_COUNT);

	return {
		backgroundImage: `url(${src})`,
		backgroundSize: `${SPRITE_COLUMN_COUNT * 100}% ${rowCount * 100}%`,
		backgroundPosition: `${((index % SPRITE_COLUMN_COUNT) / (SPRITE_COLUMN_COUNT - 1)) * 100}% ${(Math.floor(index / SPRITE_COLUMN_COUNT) / (rowCount - 1)) * 100}%`,
	};
};

const speciesNames: Record<string, string> = {
	budgie: '사랑앵무(잉꼬)',
	cockatiel: '왕관앵무',
	lovebird: '모란앵무',
	parrotlet: '유리앵무',
	conure: '코뉴어',
	quaker: '퀘이커',
	caique: '카이큐',
	ringneck: '목도리앵무',
	senegal: '세네갈앵무',
	lory: '로리앵무',
	'african-grey': '회색앵무',
	eclectus: '뉴기니아앵무',
	amazon: '아마존앵무',
	cockatoo: '코카투',
	macaw: '금강앵무',
};

/** 앵무새 종 ID를 한국어 이름으로 변환하는 함수 */
export const toSpeciesName = (species: string) => {
	// 사용자가 직접 입력한 종은 그대로 표시
	return speciesNames[species] ?? species;
};

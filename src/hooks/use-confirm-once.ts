import { useEffect, useRef } from 'react';

/**
 * 확인 버튼을 한 번만 실행하는 Hook
 * @param onConfirm 확인 버튼을 누를 때 실행할 함수
 * @param open 다이얼로그 표시 여부
 * @param busy 확인 요청 진행 여부
 */
export const useConfirmOnce = (onConfirm: () => void, open: boolean, busy: boolean) => {
	const confirmedRef = useRef(false);

	/** 다이얼로그를 다시 표시하거나 요청이 완료되면 클릭 허용 */
	useEffect(() => {
		if (!busy) {
			confirmedRef.current = false;
		}
	}, [open, busy]);

	return () => {
		if (confirmedRef.current) {
			return;
		}

		confirmedRef.current = true;
		onConfirm();
	};
};

import { KILOBYTE, MEGABYTE } from '@/config/units';

/** 파일 크기를 "40KB", "1.2MB" 형식으로 변환하는 함수 */
export const formatFileSize = (bytes: number) => {
	if (bytes < MEGABYTE) {
		return `${Math.max(1, Math.round(bytes / KILOBYTE))}KB`;
	}

	return `${(bytes / MEGABYTE).toFixed(1)}MB`;
};

/** 파일을 브라우저의 다운로드 폴더에 저장하는 함수 */
export const saveFile = (file: Blob, fileName: string) => {
	const fileUrl = URL.createObjectURL(file);
	const link = document.createElement('a');

	link.href = fileUrl;
	link.download = fileName;
	link.click();

	URL.revokeObjectURL(fileUrl);
};

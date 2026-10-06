'use client';

import type { Platform } from '@/types/apis/app-updates';

import { useGetAppUpdate } from '@/hooks/apis/app-updates';

import AppUpdateFields from '@/app/(main)/(backoffice)/app-updates/_components/app-update-fields';

interface Props {
	platform: Platform;
}

/**
 * 앱 업데이트 정보 폼 컴포넌트
 * @param platform 정보를 저장할 플랫폼
 */
const AppUpdateForm = ({ platform }: Props) => {
	const { data: appUpdateData } = useGetAppUpdate({ platform });

	// 서버 값이 바뀌면 다시 마운트
	return <AppUpdateFields key={JSON.stringify(appUpdateData)} platform={platform} appUpdate={appUpdateData} />;
};

export default AppUpdateForm;

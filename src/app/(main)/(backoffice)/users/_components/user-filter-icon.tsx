import type { UserListParams } from '@/types/apis/users';

import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import ProviderIcon from '@/app/(main)/(backoffice)/_components/provider-icon';

interface Props {
	listParams?: Partial<UserListParams>;
}

/**
 * 사용자 필터 값의 로고 컴포넌트
 * @param listParams 필터 값의 목록 조회 조건
 */
const UserFilterIcon = ({ listParams }: Props) => {
	if (listParams?.provider) {
		return <ProviderIcon provider={listParams.provider} className="size-4" />;
	}

	if (listParams?.platform) {
		return <PlatformIcon platform={listParams.platform} />;
	}

	return null;
};

export default UserFilterIcon;

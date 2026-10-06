import { cookies } from 'next/headers';

import { QueriesHydration } from '@suspensive/react-query-5';

import { getLabelListOptions } from '@/legacy/hooks/apis/use-labels';

import { BACKOFFICE_COOKIE_NAME } from '@/legacy/lib/auth';

import LabelManagement from '@/app/legacy/(backoffice)/labels/_components/label-management';

export default async function Page() {
	const cookieStore = await cookies();
	const password = cookieStore.get(BACKOFFICE_COOKIE_NAME)?.value ?? '';

	return (
		<div className="flex flex-1 flex-col">
			<div className="mb-4">
				<h2 className="text-lg font-bold">라벨 관리</h2>
			</div>

			<QueriesHydration queries={[getLabelListOptions(password)]}>
				<LabelManagement />
			</QueriesHydration>
		</div>
	);
}

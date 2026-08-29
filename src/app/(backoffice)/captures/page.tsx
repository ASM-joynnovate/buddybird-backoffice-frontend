import { cookies } from 'next/headers';

import { QueriesHydration } from '@suspensive/react-query-5';

import { AudioCaptureListParams } from '@/types/apis/audio-captures';

import { getAudioCaptureListOptions } from '@/hooks/apis/use-audio-captures';
import { getLabelListOptions } from '@/hooks/apis/use-labels';

import { BACKOFFICE_COOKIE_NAME } from '@/lib/auth';

import CaptureFilters from '@/app/(backoffice)/captures/_components/capture-filters';
import CaptureTable from '@/app/(backoffice)/captures/_components/capture-table';
import ExportButton from '@/app/(backoffice)/captures/_components/export-button';

export default async function Page(props: PageProps<'/captures'>) {
	const cookieStore = await cookies();
	const password = cookieStore.get(BACKOFFICE_COOKIE_NAME)?.value ?? '';

	const searchParams = await props.searchParams;

	const labelOptionIds = [searchParams.labelOptionIds ?? []].flat().filter(Boolean) as string[] | undefined;

	const params: AudioCaptureListParams = {
		page: Number(searchParams.page) || 1,
		countByPage: Number(searchParams.countByPage) || 12,
		firebaseAnonUid: searchParams.firebaseAnonUid as string | undefined,
		wordLabel: searchParams.wordLabel as string | undefined,
		labelOptionIds: labelOptionIds?.length ? labelOptionIds : undefined,
		dateFrom: searchParams.dateFrom as string | undefined,
		dateTo: searchParams.dateTo as string | undefined,
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-bold">오디오 캡처</h2>
				<ExportButton />
			</div>

			<QueriesHydration queries={[getAudioCaptureListOptions(params, password), getLabelListOptions(password)]}>
				<CaptureFilters />

				<div className="mt-4 flex flex-1 flex-col">
					<CaptureTable params={params} />
				</div>
			</QueriesHydration>
		</div>
	);
}

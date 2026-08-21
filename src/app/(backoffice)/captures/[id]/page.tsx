import { cookies } from 'next/headers';

import { QueriesHydration } from '@suspensive/react-query-5';

import { getAudioCaptureDetailOptions } from '@/hooks/apis/use-audio-captures';
import { getLabelListOptions } from '@/hooks/apis/use-labels';

import { BACKOFFICE_COOKIE_NAME } from '@/lib/auth';

import LabelingWorkspace from '@/app/(backoffice)/captures/[id]/_components/labeling-workspace';

export default async function Page(props: PageProps<'/captures/[id]'>) {
	const cookieStore = await cookies();
	const password = cookieStore.get(BACKOFFICE_COOKIE_NAME)?.value ?? '';

	const params = await props.params;

	return (
		<div>
			<QueriesHydration
				queries={[getAudioCaptureDetailOptions(params.id, password), getLabelListOptions(password)]}
			>
				<LabelingWorkspace audioCaptureId={params.id} />
			</QueriesHydration>
		</div>
	);
}

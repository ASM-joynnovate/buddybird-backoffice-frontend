import type { Correctness, SessionSoundKind } from '@/types/apis/sessions';

import type { FilterGroup } from '@/types/filter';

export const DEFAULT_LABELS: Correctness[] = ['correct', 'none'];

export const LABEL_FILTER_GROUP = {
	name: 'label',
	label: '라벨',
	multiple: true,
	defaultValue: DEFAULT_LABELS.join(','),
	allOption: { label: '전체' },
	options: [
		{ value: 'correct', label: '맞음' },
		{ value: 'incorrect', label: '틀림' },
		{ value: 'none', label: '라벨 없음' },
	],
} satisfies FilterGroup;

export const SOUND_KIND_FILTER_GROUP = {
	name: 'sound_kind',
	label: '종류',
	defaultValue: 'parrot',
	options: [
		{ value: 'all', label: '전체' },
		{ value: 'parrot', label: '앵무새 O' },
		{ value: 'mimic', label: '모사' },
		{ value: 'not_parrot', label: '앵무새 X' },
	],
} satisfies FilterGroup;

export const SOUND_KIND_FILTER_KINDS: Record<string, SessionSoundKind[] | undefined> = {
	all: undefined,
	parrot: ['parrot', 'mimic'],
	mimic: ['mimic'],
	not_parrot: ['not_parrot'],
};

export const SOUND_REVIEW_FILTER_GROUP = {
	name: 'sound_review',
	label: '사용자 리뷰',
	allOption: { label: '전체' },
	options: [
		{ value: 'correct', label: '맞음' },
		{ value: 'incorrect', label: '틀림' },
		{ value: 'none', label: '리뷰 없음' },
	],
} satisfies FilterGroup;

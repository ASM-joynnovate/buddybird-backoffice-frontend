import Form from 'next/form';

import { type NotificationKind, notificationKindSchema } from '@/types/apis/notifications';

import { UUID_PATTERN } from '@/config';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const kindOptions = [
	{ label: '전체', value: null },
	...notificationKindSchema.options.map((notificationKind) => ({ label: notificationKind, value: notificationKind })),
];

interface Props {
	user_id?: string;
	kind?: NotificationKind;
}

/**
 * 알림 발송 이력 검색 폼 컴포넌트
 * @param user_id 조회 조건의 사용자 ID
 * @param kind 조회 조건의 알림 종류
 */
const NotificationSearchForm = ({ user_id, kind }: Props) => {
	return (
		<Form action="/notifications" className="flex items-end gap-2">
			<div className="space-y-2">
				<Label htmlFor="search-user-id">사용자 ID</Label>
				<Input
					id="search-user-id"
					name="user_id"
					defaultValue={user_id}
					pattern={UUID_PATTERN}
					title="UUID 형식으로 입력해 주세요."
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="search-kind">종류</Label>
				<Select id="search-kind" name="kind" defaultValue={kind ?? null} items={kindOptions}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{kindOptions.map((kindOption) => (
							<SelectItem key={kindOption.label} value={kindOption.value}>
								{kindOption.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Button type="submit">검색</Button>
		</Form>
	);
};

export default NotificationSearchForm;

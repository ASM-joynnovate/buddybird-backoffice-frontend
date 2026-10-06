import Form from 'next/form';

import { USER_KEYWORD_MAX_LENGTH } from '@/config';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const deletionOptions = [
	{ label: '전체', value: null },
	{ label: '삭제됨', value: 'true' },
	{ label: '삭제 안 됨', value: 'false' },
];

interface Props {
	keyword?: string;
	is_deleted?: boolean;
}

/**
 * 사용자 검색 폼 컴포넌트
 * @param keyword 조회 조건의 검색어
 * @param is_deleted 조회 조건의 삭제 여부
 */
const UserSearchForm = ({ keyword, is_deleted }: Props) => {
	const selectedDeletion = is_deleted === undefined ? null : String(is_deleted);

	return (
		<Form action="/users" className="flex items-end gap-2">
			<div className="space-y-2">
				<Label htmlFor="keyword">닉네임 또는 이메일</Label>
				<Input id="keyword" name="keyword" defaultValue={keyword} maxLength={USER_KEYWORD_MAX_LENGTH} />
			</div>

			<div className="grid gap-2">
				<Label htmlFor="is-deleted">삭제 여부</Label>
				<Select id="is-deleted" name="is_deleted" defaultValue={selectedDeletion} items={deletionOptions}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{deletionOptions.map((deletionOption) => (
							<SelectItem key={deletionOption.label} value={deletionOption.value}>
								{deletionOption.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Button type="submit">검색</Button>
		</Form>
	);
};

export default UserSearchForm;

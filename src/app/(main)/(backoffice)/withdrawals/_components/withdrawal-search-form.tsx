import Form from 'next/form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const completionOptions = [
	{ label: '전체', value: null },
	{ label: '완료', value: 'true' },
	{ label: '미완료', value: 'false' },
];

interface Props {
	is_completed?: boolean;
}

/**
 * 탈퇴 검색 폼 컴포넌트
 * @param is_completed 조회 조건의 완료 여부
 */
const WithdrawalSearchForm = ({ is_completed }: Props) => {
	const selectedCompletion = is_completed === undefined ? null : String(is_completed);

	return (
		<Form action="/withdrawals" className="flex items-center gap-2">
			<Label htmlFor="is-completed">완료 여부</Label>
			<Select id="is-completed" name="is_completed" defaultValue={selectedCompletion} items={completionOptions}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{completionOptions.map((completionOption) => (
						<SelectItem key={completionOption.label} value={completionOption.value}>
							{completionOption.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button type="submit">검색</Button>
		</Form>
	);
};

export default WithdrawalSearchForm;

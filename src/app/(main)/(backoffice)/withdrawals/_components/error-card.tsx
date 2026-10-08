import type { WithdrawalDashboard } from '@/types/apis/dashboard';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { WITHDRAWAL_ERRORS } from '@/config/withdrawal';

interface Props {
	errors: WithdrawalDashboard['errors'];
}

/**
 * 오류 코드별 실패 횟수 카드 컴포넌트
 * @param errors 오류 코드별 실패 횟수
 */
const ErrorCard = ({ errors }: Props) => {
	return (
		<TitledCard title="오류" action=<span className="text-[13px] text-muted-foreground">실패한 횟수</span>>
			{errors.length === 0 ? (
				<p className="text-muted-foreground">실패한 탈퇴가 없습니다.</p>
			) : (
				<ul className="divide-y">
					{errors.map(({ error_code, count }) => {
						const errorLabel = WITHDRAWAL_ERRORS[error_code]?.label;

						return (
							<li
								key={error_code}
								className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
							>
								<span className="min-w-0">
									{/*문구를 정하지 않은 오류 코드는 코드만 표시*/}
									<strong className="block truncate font-semibold">{errorLabel ?? error_code}</strong>

									{!!errorLabel && (
										<span className="block truncate text-[13px] text-muted-foreground">
											{error_code}
										</span>
									)}
								</span>

								<strong className="font-bold whitespace-nowrap tabular-nums">{count}회</strong>
							</li>
						);
					})}
				</ul>
			)}
		</TitledCard>
	);
};

export default ErrorCard;

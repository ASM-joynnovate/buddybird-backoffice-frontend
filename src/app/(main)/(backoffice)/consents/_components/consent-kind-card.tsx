import type { Consent } from '@/types/apis/consents';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import ConsentKindRow, { kindRowClassName } from '@/app/(main)/(backoffice)/consents/_components/consent-kind-row';

interface Props {
	consentsByKind: Map<string, Consent[]>;
	selectedKind?: string;
	newConsentWriting: boolean;
	now: number;
	onKindSelect: () => void;
}

/**
 * 고지문 종류 카드 컴포넌트
 * @param consentsByKind 종류마다 버전 목록
 * @param selectedKind 고른 종류
 * @param newConsentWriting 새 고지문을 작성 중인지 여부
 * @param now 현재 시각
 * @param onKindSelect 종류를 누르면 실행할 함수
 */
const ConsentKindCard = ({ consentsByKind, selectedKind, newConsentWriting, now, onKindSelect }: Props) => {
	return (
		<TitledCard
			title="종류"
			action=<span className="text-[13px] text-muted-foreground tabular-nums">{consentsByKind.size}개</span>
			className="xl:sticky xl:top-8"
		>
			<ul className="-mx-2 -mt-2 -mb-4 grid">
				{newConsentWriting && (
					<li className={kindRowClassName}>
						<div className="grid gap-0.5 rounded-md bg-muted px-2 py-2.5">
							<span className="font-bold">새 고지문</span>
							<span className="text-[13px] text-muted-foreground">작성 중</span>
						</div>
					</li>
				)}

				{[...consentsByKind].map(([kind, kindConsents]) => (
					<ConsentKindRow
						key={kind}
						kind={kind}
						kindConsents={kindConsents}
						selected={!newConsentWriting && kind === selectedKind}
						now={now}
						onSelect={onKindSelect}
					/>
				))}
			</ul>
		</TitledCard>
	);
};

export default ConsentKindCard;

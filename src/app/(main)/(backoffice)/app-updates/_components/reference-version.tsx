interface Props {
	name: string;
	version: string;
	description: string;
}

/**
 * 기기 묶음을 나누는 기준 버전 컴포넌트
 * @param name 기준 버전의 이름
 * @param version 표시할 버전
 * @param description 기준 버전의 설명
 */
const ReferenceVersion = ({ name, version, description }: Props) => {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-0.5 @min-[720px]:grid-cols-1 @min-[720px]:content-start @min-[720px]:px-0 @min-[720px]:pt-2.5 @min-[720px]:pb-0 @min-[720px]:text-center">
			<span className="text-[12.5px] leading-[19px] font-semibold">{name}</span>

			{/*양옆 칸까지 이어지는 가로선 위에 버전 표시*/}
			<div className="relative row-span-2 @min-[720px]:row-span-1 @min-[720px]:before:absolute @min-[720px]:before:-inset-x-3 @min-[720px]:before:top-1/2 @min-[720px]:before:border-t @min-[720px]:before:border-border">
				<strong className="relative inline-block bg-card text-base leading-9 font-bold tabular-nums @min-[720px]:px-3">
					{version}
				</strong>
			</div>

			<small className="text-[12.5px] leading-[1.4] text-balance text-muted-foreground @min-[720px]:mt-2.5">
				{description}
			</small>
		</div>
	);
};

export default ReferenceVersion;

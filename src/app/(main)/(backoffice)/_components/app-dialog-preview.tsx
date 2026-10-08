import type { ReactNode } from 'react';

interface Props {
	label: string;
	title: ReactNode;
	closeLabel?: string;
	acceptLabel: string;
	children: ReactNode;
}

/**
 * 앱에 표시되는 다이얼로그의 미리보기 컴포넌트
 * @param label 미리보기의 aria-label
 * @param title 다이얼로그 제목
 * @param closeLabel 왼쪽 버튼 문구
 * @param acceptLabel 오른쪽 버튼 문구
 * @param children 제목 아래에 표시할 내용
 */
const AppDialogPreview = ({ label, title, closeLabel, acceptLabel, children }: Props) => {
	// 앱에는 어두운 화면이 없어 색을 고정
	return (
		<div aria-label={label} className="grid gap-5 rounded-2xl bg-white px-5 py-6 text-[#3c3c3c] ring-1 ring-border">
			<strong className="text-lg leading-6 font-black wrap-anywhere">{title}</strong>

			{children}

			<div aria-hidden className="flex gap-3 pb-1.5 text-base font-extrabold">
				{!!closeLabel && (
					<span className="grid min-h-13 flex-1 place-items-center rounded-[16px] border-2 border-[#e5e5e5] bg-white shadow-[0_6px_0_#e5e5e5]">
						{closeLabel}
					</span>
				)}
				<span className="grid min-h-13 flex-1 place-items-center rounded-[16px] bg-[#ff9600] text-white shadow-[0_6px_0_#e07f00]">
					{acceptLabel}
				</span>
			</div>
		</div>
	);
};

export default AppDialogPreview;

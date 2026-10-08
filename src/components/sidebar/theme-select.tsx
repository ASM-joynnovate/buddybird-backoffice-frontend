'use client';

import { useState } from 'react';

import type { Theme } from '@/types/theme';

import { saveTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const themeOptions: { label: string; value: Theme | undefined }[] = [
	{ label: '시스템', value: undefined },
	{ label: '밝게', value: 'light' },
	{ label: '어둡게', value: 'dark' },
];

interface Props {
	theme?: Theme;
}

/**
 * 화면 모드 선택 컴포넌트
 * @param theme 쿠키에 저장된 화면 모드
 */
const SidebarThemeSelect = ({ theme }: Props) => {
	const [selectedTheme, setSelectedTheme] = useState(theme);

	const handleSelectTheme = (themeOption: Theme | undefined) => {
		setSelectedTheme(themeOption);
		saveTheme(themeOption);
	};

	return (
		<fieldset className="grid min-w-0 grid-cols-3 rounded-lg bg-sidebar-accent p-0.5">
			<legend className="sr-only">화면 모드</legend>

			{themeOptions.map((themeOption) => (
				<button
					key={themeOption.label}
					type="button"
					aria-pressed={selectedTheme === themeOption.value}
					className={cn(
						'h-7 rounded-md text-xs font-semibold text-sidebar-foreground/65',
						selectedTheme === themeOption.value && 'bg-sidebar text-sidebar-foreground',
					)}
					onClick={() => handleSelectTheme(themeOption.value)}
				>
					{themeOption.label}
				</button>
			))}
		</fieldset>
	);
};

export default SidebarThemeSelect;

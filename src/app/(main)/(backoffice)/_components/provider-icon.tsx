import type { Provider } from '@/types/apis/users';

import { cn } from '@/lib/utils';

export const PROVIDER_LABELS: Record<Provider, string> = { google: 'Google', apple: 'Apple', kakao: 'Kakao' };

interface Props {
	provider: Provider;
	className?: string;
}

/**
 * 로그인 방식의 로고 컴포넌트
 * @param provider 로그인 방식
 * @param className 로고 배경에 더할 class
 */
const ProviderIcon = ({ provider, className }: Props) => {
	return (
		<span
			aria-hidden
			className={cn(
				'grid size-5 shrink-0 place-items-center rounded-full',
				provider === 'google' && 'bg-white ring-1 ring-[#e6e5e0] ring-inset',
				provider === 'kakao' && 'bg-[#fee500] text-black',
				provider === 'apple' && 'bg-foreground text-card',
				className,
			)}
		>
			{provider === 'google' && (
				<svg viewBox="0 0 48 48" className="size-[55%]">
					<path
						fill="#EA4335"
						d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
					/>
					<path
						fill="#4285F4"
						d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
					/>
					<path
						fill="#FBBC05"
						d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
					/>
					<path
						fill="#34A853"
						d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
					/>
				</svg>
			)}

			{provider === 'kakao' && (
				<svg viewBox="0 0 18 18" className="size-[55%] fill-current">
					<path d="M9 1C4.029 1 0 4.129 0 7.987c0 2.399 1.558 4.516 3.932 5.774l-1 3.665c-.09.323.28.58.563.393L7.87 14.87c.37.041.747.063 1.13.063 4.971 0 9-3.129 9-6.987C18 4.129 13.971 1 9 1Z" />
				</svg>
			)}

			{provider === 'apple' && (
				<svg viewBox="0 0 24 24" className="-mt-px size-[55%] fill-current">
					<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
				</svg>
			)}
		</span>
	);
};

export default ProviderIcon;

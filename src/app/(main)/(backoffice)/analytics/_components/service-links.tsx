import Image from 'next/image';

import { ExternalLink } from 'lucide-react';

import { SERVICE_LINKS } from '@/config/analytics';

/** 분석에 사용하는 외부 서비스의 링크 목록 컴포넌트 */
const ServiceLinks = () => {
	return (
		<nav aria-label="외부 서비스" className="flex flex-wrap gap-1.5">
			{SERVICE_LINKS.map((serviceLink) => (
				<a
					key={serviceLink.label}
					href={serviceLink.href}
					target="_blank"
					rel="noopener"
					aria-label={`${serviceLink.label} 새 탭에서 열기`}
					className="inline-flex h-7 items-center gap-1.5 rounded-full bg-card pr-2.5 pl-1 text-[13px] font-semibold whitespace-nowrap ring-1 ring-border transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				>
					<Image
						src={serviceLink.logoSrc}
						alt=""
						width={20}
						height={20}
						unoptimized
						className="size-5 rounded-full"
					/>
					{serviceLink.label}
					<ExternalLink className="size-3.5 text-muted-foreground" />
				</a>
			))}
		</nav>
	);
};

export default ServiceLinks;

import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs/config';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: false,
};

export default withSentryConfig(nextConfig, {
	org: 'joynnovate',
	project: 'buddybird-backoffice',
	authToken: process.env.SENTRY_AUTH_TOKEN,
	widenClientFileUpload: true,
	silent: !process.env.CI,
	release: { name: `buddybird-backoffice@${process.env.npm_package_version}` },
});

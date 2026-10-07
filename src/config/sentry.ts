import { env } from '@/config/env';

export const sentryOptions = {
	dsn: 'https://cd8c5c382d8adfd2cfc467270a336a7b@o4512127698862080.ingest.de.sentry.io/4512209524686928',
	enabled: !!env.environment,
	environment: env.environment,
	tracesSampleRate: 1.0,
};

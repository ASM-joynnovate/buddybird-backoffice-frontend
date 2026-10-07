import { captureRouterTransitionStart, init } from '@sentry/nextjs';

import { sentryOptions } from '@/config/sentry';

init(sentryOptions);

export const onRouterTransitionStart = captureRouterTransitionStart;

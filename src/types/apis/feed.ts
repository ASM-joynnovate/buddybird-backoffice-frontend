import { z } from 'zod';

export const feedItemKindSchema = z.enum([
	'mimic_succeeded',
	'total_learning_time_reached',
	'monthly_learning_time_reached',
	'word_play_count_reached',
]);

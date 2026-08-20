import pluginQuery from '@tanstack/eslint-plugin-query';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	...nextVitals,
	...nextTs,
	...pluginQuery.configs['flat/recommended'],
	{
		plugins: { 'no-relative-import-paths': noRelativeImportPaths },
		rules: {
			'no-relative-import-paths/no-relative-import-paths': [
				'error',
				{ allowSameFolder: true, rootDir: 'src', prefix: '@' },
			],
		},
	},
	prettier,
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.yarn/**']),
]);

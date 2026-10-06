import { defineConfig } from 'oxlint';
import web from 'oxlint-config-universe/web';

const relativeImport = {
	group: ['./**', '../**'],
	message: "Use the project's @/ import alias.",
};

export default defineConfig({
	extends: [web],
	plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'import', 'node', 'react', 'promise', 'nextjs', 'jsx-a11y'],
	jsPlugins: ['@tanstack/eslint-plugin-query'],
	options: { typeAware: true, denyWarnings: true },
	ignorePatterns: ['node_modules', '.next', 'out', 'build', '.yarn', 'next-env.d.ts', 'src/legacy', 'src/app/legacy'],
	rules: {
		'react/exhaustive-deps': 'warn',
		'one-var': ['error', 'never'],
		curly: ['error', 'all'],
		'typescript/no-require-imports': 'warn',
		'no-restricted-imports': ['error', { patterns: [relativeImport] }],
		'no-void': 'off',
		'typescript/unbound-method': 'off',
		'react/set-state-in-effect': 'off',
		'promise/no-callback-in-promise': 'off',

		'typescript/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
		'typescript/no-import-type-side-effects': 'error',
		'no-shadow': 'error',
		'typescript/no-non-null-assertion': 'error',
		'promise/no-multiple-resolved': 'error',
		'no-param-reassign': 'error',
		'react/jsx-no-constructed-context-values': 'error',
		'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
		'react/no-deriving-state-in-effects': 'warn',
		'react/memo-dependencies': 'warn',
		'react/jsx-key': [
			'error',
			{ checkFragmentShorthand: true, checkKeyMustBeforeSpread: true, warnOnDuplicates: true },
		],
		'array-callback-return': 'error',
		'preserve-caught-error': 'error',
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'typescript/ban-ts-comment': [
			'error',
			{ 'ts-expect-error': 'allow-with-description', minimumDescriptionLength: 10 },
		],
		'typescript/no-explicit-any': 'warn',
		'import/no-self-import': 'error',
		'unicorn/error-message': 'error',
		'unicorn/no-instanceof-array': 'error',
		'unicorn/no-array-fill-with-reference-type': 'error',
		'oxc/no-accumulating-spread': 'error',

		'typescript/no-floating-promises': 'error',
		'typescript/no-misused-promises': ['error', { checksVoidReturn: false }],
		'typescript/await-thenable': 'error',
		'typescript/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
		'typescript/restrict-template-expressions': 'error',
		'typescript/prefer-nullish-coalescing': ['error', { ignorePrimitives: { string: true, boolean: true } }],
		'typescript/strict-void-return': 'error',
		'typescript/no-deprecated': 'warn',
		'typescript/no-unsafe-argument': 'warn',
		'typescript/no-unsafe-member-access': 'warn',
		'typescript/no-unsafe-return': 'warn',

		'@tanstack/query/exhaustive-deps': 'error',
		'@tanstack/query/no-rest-destructuring': 'warn',
		'@tanstack/query/stable-query-client': 'error',
		'@tanstack/query/no-unstable-deps': 'error',
		'@tanstack/query/infinite-query-property-order': 'error',
		'@tanstack/query/mutation-property-order': 'error',
	},
	overrides: [
		{
			files: ['src/hooks/**', 'src/apis/**', 'src/lib/**'],
			rules: {
				'no-magic-numbers': ['error', { ignore: [0, 1, -1, 2, 100, 1000] }],
			},
		},
	],
});

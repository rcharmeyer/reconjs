// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/config/eslint'
import pluginCspell from '@cspell/eslint-plugin'
import vitest from '@vitest/eslint-plugin'

export default [
  ...tanstackConfig,
  {
    name: '@reconjs-root',
    plugins: {
      cspell: pluginCspell,
    },
    rules: {
      'cspell/spellchecker': [
        'warn',
        {
          cspell: {
            words: [
              'codemod', // We support our codemod
              'combinate', // Library name
              'extralight', // Our public interface
              'jscodeshift',
              'Promisable', // Our public interface
              'retryer', // Our public interface
              'solidjs', // Our target framework
              'tabular-nums', // https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
              'tanstack', // Our package scope
              'todos', // Too general word to be caught as error
              'TSES', // @typescript-eslint package's interface
              'tsqd', // Our public interface (TanStack Query Devtools shorthand)
              'tsup', // We use tsup as builder
              'typecheck', // Field of vite.config.ts
              'vue-demi', // dependency of @tanstack/vue-query
            ],
          },
        },
      ],
      '@typescript-eslint/naming-convention': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/array-type': 'warn',
      'import/order': 'warn',
      'no-case-declarations': 'off',
      'sort-imports': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts*', '**/*.test.ts*', '**/*.test-d.ts*'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': 'warn',
    },
    settings: { vitest: { typecheck: true } },
  },
]
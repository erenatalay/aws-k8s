// @ts-check
/**
 * Monorepo Root ESLint Configuration
 * Her proje kendi eslint.config.mjs dosyasını kullanır.
 * Bu dosya sadece root seviyesinde lint çalıştırıldığında kullanılır.
 */

import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/coverage/**',
      '**/generated/**',
      '**/prisma/generated/**',
      '**/*.js',
      '**/*.mjs',
      '**/*.d.ts',
      '**/src/gql/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2022,
      },
    },
  },
  {
    rules: {
      // Unused Variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // General
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
);

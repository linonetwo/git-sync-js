module.exports = {
  rules: {
    'unicorn/prevent-abbreviations': [
      'error',
      {
        whitelist: {
          mod: true,
          Mod: true,
          props: true,
          Props: true,
          i18n: true,
          i18next: true,
          i18nMainBindings: true,
          'i18next-electron-fs-backend': true,
        },
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/method-signature-style': 'off',
    'unicorn/no-array-reduce': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'semi', // 'none' or 'semi' or 'comma'
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi', // 'semi' or 'comma'
          requireLast: false,
        },
      },
    ],
    'comma-dangle': [2, 'always-multiline'],
    'no-undef': 'off',
    'unicorn/no-array-for-each': 'off',
    'multiline-ternary': 'off',
    'unicorn/filename-case': [
      0,
      {
        case: 'camelCase',
        ignore: [/tsx$/],
      },
    ],
    'unicorn/consistent-function-scoping': [0],
    'no-void': [0],
    'unicorn/prefer-ternary': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    semi: [0],
    'no-use-before-define': [0],
    '@typescript-eslint/no-use-before-define': [1],
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:security/recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'standard-with-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:security-node/recommended',
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'react', 'html', 'react', 'unicorn', 'import', 'react-hooks', 'security', 'security-node'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
};

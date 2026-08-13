module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  ignorePatterns: ['dist/**', 'node_modules/**', 'public/**'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: '18.2.0' },
  },
  rules: {
    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',  // Disabilitato: usiamo JSDoc invece di PropTypes
    
    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // JSX A11y
    'jsx-a11y/anchor-is-valid': 'warn',
    
    // Base
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};

module.exports = {
  extends: ['react-app'],
  rules: {
    'no-unused-vars': 'warn', // Downgrade from error to warning
    'react-hooks/exhaustive-deps': 'warn', // Downgrade from error to warning
    'default-case': 'warn', // Downgrade from error to warning
  }
};
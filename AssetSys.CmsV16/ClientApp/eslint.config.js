// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

// Cấu hình phẳng (eslint 9) thay cho .eslintrc.json cũ. Giữ đúng phạm vi rule như
// bản .eslintrc.json trên Angular 16: chỉ bật preset của angular-eslint, KHÔNG bật
// eslint:recommended / typescript-eslint:recommended để không phát sinh hàng nghìn
// lỗi mới (no-explicit-any, no-var...) ngoài phạm vi việc nâng version.
module.exports = tseslint.config(
  {
    ignores: ['projects/**/*', 'dist/**/*', '.angular/**/*'],
  },
  {
    files: ['**/*.ts'],
    // tseslint.configs.base chỉ nạp plugin + parser (không bật rule nào) để các
    // comment eslint-disable @typescript-eslint/* trong code vẫn tham chiếu được rule.
    extends: [tseslint.configs.base, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/no-input-rename': 'off',
      // App dựng theo NgModule (standalone: false do migration Angular 19 thêm vào)
      // và inject qua constructor. Hai rule này là mặc định mới của angular-eslint
      // v19+, không phải lỗi thực tế của code.
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }
);

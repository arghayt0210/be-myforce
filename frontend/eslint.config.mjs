import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  ...compat.config({
    ignorePatterns: ['src/hooks/use-toast.ts', '**/use-toast.ts'],
    extends: ['eslint:recommended',
     'plugin:@next/next/recommended','next', 'prettier'],
  }),
]

export default eslintConfig
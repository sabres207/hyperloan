import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../server/src/schema.graphql.ts',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/__generated__/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
      },
    },
  },
}

export default config

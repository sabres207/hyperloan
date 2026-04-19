import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/schema.graphql.ts',
  generates: {
    './src/__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../context.js#Context',
        useIndexSignature: true,
        mappers: {
          Loan: '../entities/Loan.js#Loan as LoanEntity',
        },
      },
    },
  },
}

export default config

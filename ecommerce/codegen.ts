import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  documents: ['src/graphql/operations/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    // Tek çıktı klasörü - tüm tipler ve operations
    './src/graphql/generated/': {
      preset: 'client',
      config: {
        documentMode: 'documentNode',
        skipTypename: false,
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string',
        },
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;

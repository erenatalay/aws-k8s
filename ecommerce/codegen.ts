import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  documents: ['src/graphql/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    // Ana type dosyası
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        skipTypename: false,
        withHooks: false,
        withHOC: false,
        withComponent: false,
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string',
        },
        // Error handling için
        errorType: 'GraphQLError',
      },
    },
    // React hooks için ayrı dosya
    './src/generated/hooks.ts': {
      preset: 'client',
      config: {
        documentMode: 'documentNode',
        fragmentMasking: false,
      },
    },
    // Schema introspection
    './src/generated/schema.json': {
      plugins: ['introspection'],
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;

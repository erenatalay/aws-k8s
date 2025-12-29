import { print, GraphQLSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { stitchSchemas } from '@graphql-tools/stitch';
import { schemaFromExecutor } from '@graphql-tools/wrap';

const authUrl = process.env.AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';
const productUrl =
  process.env.PRODUCT_GRAPHQL_URL ?? 'http://localhost:3002/graphql';

type ExecutorArgs = {
  document: any;
  variables?: Record<string, unknown>;
  context?: { headers?: Record<string, string> };
};

const makeExecutor =
  (url: string) =>
  async ({ document, variables, context }: ExecutorArgs) => {
    const query = print(document);
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...(context?.headers ?? {}),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
    });

    return res.json();
  };

async function buildGatewaySchema(): Promise<GraphQLSchema> {
  const authExecutor = makeExecutor(authUrl);
  const productExecutor = makeExecutor(productUrl);

  const authSchema = await schemaFromExecutor(authExecutor as any);
  const productSchema = await schemaFromExecutor(productExecutor as any);

  return stitchSchemas({
    subschemas: [
      { schema: authSchema, executor: authExecutor as any },
      { schema: productSchema, executor: productExecutor as any },
    ],
  });
}

let stitchedSchemaPromise: Promise<GraphQLSchema> | null = null;

const getSchema = () => {
  if (!stitchedSchemaPromise) {
    stitchedSchemaPromise = buildGatewaySchema();
  }
  return stitchedSchemaPromise;
};

const yoga = createYoga<{ request: NextRequest }>({
  schema: () => getSchema(),
  graphqlEndpoint: '/api/graphql',
  context: ({ request }) => ({ headers: Object.fromEntries(request.headers) }),
  maskedErrors: false,
});

function handler(request: NextRequest) {
  return yoga.handleRequest(request, { request });
}

export const GET = (req: NextRequest) => handler(req);
export const POST = (req: NextRequest) => handler(req);


import { ResultOf, DocumentTypeDecoration, TypedDocumentNode } from '@graphql-typed-document-node/core';
import { FragmentDefinitionNode } from 'graphql';
import { Incremental } from './graphql';


export type FragmentType<TDocumentType extends DocumentTypeDecoration<any, any>> = TDocumentType extends DocumentTypeDecoration<
  infer TType,
  any
>
  ? [TType] extends [{ ' $fragmentName'?: infer TKey }]
    ? TKey extends string
      ? { ' $fragmentRefs'?: { [key in TKey]: TType } }
      : never
    : never
  : never;


export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>>
): TType;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | undefined
): TType | undefined;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | null
): TType | null;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | null | undefined
): TType | null | undefined;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: Array<FragmentType<DocumentTypeDecoration<TType, any>>>
): Array<TType>;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: Array<FragmentType<DocumentTypeDecoration<TType, any>>> | null | undefined
): Array<TType> | null | undefined;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>>
): ReadonlyArray<TType>;

export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>> | null | undefined
): ReadonlyArray<TType> | null | undefined;
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | Array<FragmentType<DocumentTypeDecoration<TType, any>>> | ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>> | null | undefined
): TType | Array<TType> | ReadonlyArray<TType> | null | undefined {
  return fragmentType as any;
}


export function makeFragmentData<
  F extends DocumentTypeDecoration<any, any>,
  FT extends ResultOf<F>
>(data: FT, _fragment: F): FragmentType<F> {
  return data as FragmentType<F>;
}
export function isFragmentReady<TQuery, TFrag>(
  queryNode: DocumentTypeDecoration<TQuery, any>,
  fragmentNode: TypedDocumentNode<TFrag>,
  data: FragmentType<TypedDocumentNode<Incremental<TFrag>, any>> | null | undefined
): data is FragmentType<typeof fragmentNode> {
  const deferredFields = (queryNode as { __meta__?: { deferredFields: Record<string, (keyof TFrag)[]> } }).__meta__
    ?.deferredFields;

  if (!deferredFields) return true;

  const fragDef = fragmentNode.definitions[0] as FragmentDefinitionNode | undefined;
  const fragName = fragDef?.name?.value;

  const fields = (fragName && deferredFields[fragName]) || [];
  return fields.length > 0 && fields.every(field => data && field in data);
}

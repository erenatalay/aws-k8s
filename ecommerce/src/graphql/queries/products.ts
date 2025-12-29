import { graphql } from '../../gql';

export const GET_PRODUCTS = graphql(`
  query GetProducts($query: QueryProductInput) {
    products(query: $query) {
      data {
        id
        name
        description
        price
        userId
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const GET_PRODUCT = graphql(`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      price
      userId
      createdAt
      updatedAt
    }
  }
`);

export const CREATE_PRODUCT = graphql(`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(createProductInput: $input) {
      id
      name
      description
      price
      userId
      createdAt
      updatedAt
    }
  }
`);

export const UPDATE_PRODUCT = graphql(`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, updateProductInput: $input) {
      id
      name
      description
      price
      userId
      createdAt
      updatedAt
    }
  }
`);

export const DELETE_PRODUCT = graphql(`
  mutation DeleteProduct($id: String!) {
    removeProduct(id: $id) {
      message
    }
  }
`);

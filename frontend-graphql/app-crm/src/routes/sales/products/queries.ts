import { gql } from "@apollo/client";

export const PRODUCTS_TABLE_QUERY = gql`
  query ProductsTable {
    products {
      id
      name
      salesPrice
      createdAt
    }
  }
`;

export const PRODUCT_CREATE_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(data: $input) {
      id
      name
      salesPrice
    }
  }
`;

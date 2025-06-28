import { gql } from "@apollo/client";

export const PRODUCTS_TABLE_QUERY = gql`
  query ProductsTable {
    products {
      id
      title
      unitPrice
      createdAt
    }
  }
`;

export const PRODUCT_CREATE_MUTATION = gql`
  mutation CreateProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
      title
      unitPrice
    }
  }
`;

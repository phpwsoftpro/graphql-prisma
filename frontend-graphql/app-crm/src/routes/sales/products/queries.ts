import { gql } from "@apollo/client";

export const PRODUCTS_TABLE_QUERY = gql`
  query ProductsTable($filter: ProductFilter, $sorting: [ProductSort!], $paging: OffsetPaging) {
    products(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
        id
        name
        internalReference
        responsible
        productTags
        salesPrice
        cost
        quantityOnHand
        forecastedQuantity
        unitOfMeasure
        createdAt
        status
      }
      totalCount
    }
  }
`;

export const PRODUCTS_CREATE_MUTATION = gql`
  mutation ProductsCreate($data: CreateProductInput!) {
    createProduct(data: $data) {
        id
        name
        internalReference
        responsible
        productTags
        salesPrice
        cost
        quantityOnHand
        forecastedQuantity
        unitOfMeasure
        createdAt
        status
    }
  }
`;

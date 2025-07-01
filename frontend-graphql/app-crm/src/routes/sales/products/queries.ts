import { gql } from "@apollo/client";

export const PRODUCTS_TABLE_QUERY = gql`
  query ProductsTable($filter: FilterInput, $sorting: [SortInput!], $paging: OffsetPagingInput) {
    products(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
        id
        title
        internalReference
        responsible
        productTags
        unitPrice
        cost
        quantityOnHand
        forecastedQuantity
        unitOfMeasure
        image
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
        title
        internalReference
        responsible
        productTags
        unitPrice
        cost
        quantityOnHand
        forecastedQuantity
        unitOfMeasure
        image
        createdAt
        status
    }
  }
`;

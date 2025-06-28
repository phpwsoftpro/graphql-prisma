import { gql } from "@apollo/client";

export const PRODUCTS_TABLE_QUERY = gql`
  query ProductsTable($filter: FilterInput, $sorting: [SortInput!], $paging: OffsetPagingInput) {
    products(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
        id
        name
        internalReference
        responsible
        productTags
        status
        salesPrice
        cost
        quantityOnHand
        forecastedQuantity
        unitOfMeasure
        image
        createdAt
      }
      totalCount
    }
  }
`;

export const PRODUCT_CREATE_MUTATION = gql`
  mutation CreateProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
      title
      description
      unitPrice
      status
      categoryId
    }
  }
`;

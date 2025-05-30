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

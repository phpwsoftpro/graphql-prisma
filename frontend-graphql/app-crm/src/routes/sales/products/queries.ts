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

export const PRODUCT_SHOW_QUERY = gql`
  query ProductShow($id: ID!) {
    product(id: $id) {
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
      status
      createdAt
    }
  }
`;

export const PRODUCTS_UPDATE_MUTATION = gql`
  mutation ProductsUpdate($id: ID!, $data: UpdateProductInput!) {
    updateProduct(id: $id, data: $data) {
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
      status
      createdAt
    }
  }
`;

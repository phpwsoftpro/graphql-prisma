import { gql } from "@apollo/client";

export const INVOICES_TABLE_QUERY = gql`
  query InvoicesTable($filter: FilterInput, $sorting: [SortInput!], $paging: OffsetPagingInput) {
    invoices(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
        id
        number
        customer {
          id
          name
        }
        invoiceDate
        dueDate
        activities {
          id
        }
        taxExcluded
        total
        paymentStatus
        status
      }
      totalCount
    }
  }
`;

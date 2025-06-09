import gql from "graphql-tag";

export const SALES_COMPANIES_SELECT_QUERY = gql`
    query SalesCompaniesSelect(
        $filter: CompanyFilter!
        $sorting: [CompanySort!]
        $paging: OffsetPaging!
    ) {
        companies(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
                contacts {
                    nodes {
                        name
                        id
                        avatarUrl
                    }
                }
            }
        }
    }
`;

export const SALES_CREATE_DEAL_STAGE_MUTATION = gql`
    mutation SalesCreateDealStage($input: CreateDealStageInput!) {
        createDealStage(input: $input) {
            id
            title
        }
    }
`;

export const SALES_CREATE_CONTACT_MUTATION = gql`
    mutation SalesCreateContact($input: CreateContactInput!) {
        createContact(input: $input) {
            id
        }
    }
`;

export const SALES_UPDATE_DEAL_STAGE_MUTATION = gql`
    mutation SalesUpdateDealStage($input: UpdateDealStageInput!) {
        updateDealStage(input: $input) {
            id
            title
        }
    }
`;

export const SALES_UPDATE_DEAL_MUTATION = gql`
    mutation SalesUpdateDeal($input: UpdateDealInput!) {
        updateDeal(input: $input) {
            id
            title
            stageId
            value
            dealOwnerId
            company {
                id
                contacts {
                    nodes {
                        id
                        name
                        avatarUrl
                    }
                }
            }
            dealContact {
                id
            }
        }
    }
`;

export const SALES_FINALIZE_DEAL_MUTATION = gql`
    mutation SalesFinalizeDeal($input: UpdateDealInput!) {
        updateDeal(input: $input) {
            id
            notes
            closeDateYear
            closeDateMonth
            closeDateDay
        }
    }
`;

export const SALES_DEAL_STAGES_QUERY = gql`
    query SalesDealStages(
        $filter: DealStageFilter!
        $sorting: [DealStageSort!]
        $paging: OffsetPaging
    ) {
        dealStages(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                title
                dealsAggregate {
                    sum {
                        value
                    }
                }
            }
            totalCount
        }
    }
`;

export const SALES_DEALS_QUERY = gql`
    query SalesDeals(
        $filter: DealFilter!
        $sorting: [DealSort!]
        $paging: OffsetPaging!
    ) {
        deals(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                title
                value
                createdAt
                stageId
                company {
                    id
                    name
                    avatarUrl
                }
                dealOwner {
                    id
                    name
                    avatarUrl
                }
            }
        }
    }
`;
//delete stages 
export const SALES_DELETE_DEAL_STAGE_MUTATION = gql`
    mutation SalesDeleteDealStage($input: DeleteDealStageInput!) {
        deleteDealStage(input: $input) 
    }
`;
export const SALES_CREATE_DEAL_MUTATION = gql`
    mutation SalesCreateDeal($input: CreateDealInput!) {
        createDeal(input: $input) {
            id
        }
    }
`;
//delete deal
export const SALES_DELETE_DEAL_MUTATION = gql`
    mutation SalesDeleteDeal($input: DeleteDealInput!) {
        deleteDeal(input: $input) {
            id
        }
    }
`;
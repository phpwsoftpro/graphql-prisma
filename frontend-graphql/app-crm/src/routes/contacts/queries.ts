import gql from "graphql-tag";

const CONTACT_FRAGMENT = gql`
    fragment ContactFragment on Contact {
        id
        name
        email
        company {
            id
            name
            avatarUrl
        }
        jobTitle
        status
        avatarUrl
    }
`;

export const CONTACTS_LIST_QUERY = gql`
    query ContactsList(
        $filter: ContactFilter!
        $sorting: [ContactSort!]
        $paging: OffsetPaging!
    ) {
        contacts(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                ...ContactFragment
            }
            totalCount
        }
    }
    ${CONTACT_FRAGMENT}
`;

export const CONTACT_CREATE_MUTATION = gql`
    mutation CreateContact($input: CreateContactInput!) {
        createContact(input: $input) {
            ...ContactFragment
        }
    }
    ${CONTACT_FRAGMENT}
`;

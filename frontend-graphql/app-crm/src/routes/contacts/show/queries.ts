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
        status
        jobTitle
        phone
        timezone
        avatarUrl
        salesOwner {
            id
            name
            avatarUrl
        }
        createdAt
    }
`;

export const CONTACT_SHOW_QUERY = gql`
    query ContactShow($id: ID!) {
        contact(id: $id) {
            ...ContactFragment
        }
    }
    ${CONTACT_FRAGMENT}
`;

import gql from "graphql-tag";

const EVENT_FRAGMENT = gql`
    fragment EventFragment on Event {
        id
        title
        description
        startDate
        endDate
        color
        createdAt
        createdBy {
            id
            name
        }
        category {
            id
            title
        }
        participants {
            id
            name
        }
    }
`;

export const CALENDAR_UPDATE_EVENT_MUTATION = gql`
    mutation UpdateEvent( $input: UpdateEventInput!) {
        updateEvent( input: $input) {
            ...EventFragment
        }
    }
    ${EVENT_FRAGMENT}
`;

export const CALENDAR_GET_EVENT_QUERY = gql`
    query GetEvent($id: ID!) {
        event(id: $id) {
            ...EventFragment
        }
    }
    ${EVENT_FRAGMENT}
`;
//
export const CALENDAR_CREATE_EVENT_MUTATION = gql`
    mutation CreateEvent($input: CreateEventInput!) {
        createEvent(input: $input) {
            ...EventFragment
        }
    }
    ${EVENT_FRAGMENT}
`;

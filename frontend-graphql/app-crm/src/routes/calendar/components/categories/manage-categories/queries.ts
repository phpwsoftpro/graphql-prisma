import gql from "graphql-tag";

export const CALENDAR_CREATE_EVENT_CATEGORIES_MUTATION = gql`
    mutation CreateEventCategory($input: CreateEventCategoryInput!) {
        createEventCategory(input: $input) {
            id
            title
        }
    }
`;
export const CALENDAR_DELETE_EVENT_CATEGORIES_MUTATION = gql`
    mutation DeleteEventCategory($input: DeleteEventCategoryInput!) {
        deleteEventCategory(input: $input) {
            id
        }
    }
`;
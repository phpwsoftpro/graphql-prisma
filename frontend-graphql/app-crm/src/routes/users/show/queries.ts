import gql from "graphql-tag";

export const USER_SHOW_QUERY = gql`
  query UserShow($id: ID!) {
    user(id: $id) {
      id
      name
      email
      jobTitle
      phone
      role
      avatarUrl
      status
      address
      createdAt
      updatedAt
    }
  }
`; 
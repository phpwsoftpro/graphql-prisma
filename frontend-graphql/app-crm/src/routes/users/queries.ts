import gql from "graphql-tag";

export const USERS_LIST_QUERY = gql`
  query UsersList(
    $filter: UserFilter!
    $sorting: [UserSort!]
    $paging: OffsetPaging!
  ) {
    users(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
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
      totalCount
    }
  }
`;


export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      jobTitle
      phone
      role
      status
      address
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      jobTitle
      phone
      role
      status
      address
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input){
    id 
    }
  }
`; 
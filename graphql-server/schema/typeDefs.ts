import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    position: String
  }

  type Payslip {
    id: ID!
    employeeId: ID!
    amount: Float!
    date: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
    payslips(employeeId: ID!): [Payslip!]!
  }
`;

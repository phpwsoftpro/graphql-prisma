import { employees, payslips } from '../data/mockDb';
import { Resolvers } from './types';

export const resolvers: Resolvers = {
  Query: {
    employees: () => employees,
    employee: (_parent, args) => employees.find((e) => e.id === args.id) || null,
    payslips: (_parent, args) => payslips.filter((p) => p.employeeId === args.employeeId),
  },
};

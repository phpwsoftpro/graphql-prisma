import { Employee, Payslip } from '../schema/types';

export const employees: Employee[] = [
  { id: '1', name: 'Alice Smith', position: 'Developer' },
  { id: '2', name: 'Bob Johnson', position: 'Designer' },
];

export const payslips: Payslip[] = [
  { id: '1', employeeId: '1', amount: 3000, date: '2024-06-01' },
  { id: '2', employeeId: '2', amount: 2500, date: '2024-06-01' },
];

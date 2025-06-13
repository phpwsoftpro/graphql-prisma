export interface Employee {
  id: string;
  name: string;
  position?: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
}

export interface Query {
  employees: Employee[];
  employee?: Employee | null;
  payslips: Payslip[];
}

export interface Resolvers {
  Query: {
    employees: () => Employee[];
    employee: (_parent: unknown, args: { id: string }) => Employee | null;
    payslips: (_parent: unknown, args: { employeeId: string }) => Payslip[];
  };
}

import React from "react";
import { useParams } from "react-router-dom";

export const PayrollEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="page-container">
      <h1>Edit Payroll {id}</h1>
    </div>
  );
};

export default PayrollEditPage;

import React from "react";
import { useParams } from "react-router-dom";

export const PayrollShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="page-container">
      <h1>Payroll Details {id}</h1>
    </div>
  );
};

export default PayrollShowPage;

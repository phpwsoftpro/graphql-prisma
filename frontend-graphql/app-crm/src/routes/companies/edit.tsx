import { Col, Row } from "antd";

import {
  CompanyContactsTable,
  CompanyDealsTable,
  CompanyInfoForm,
  CompanyNotes,
  CompanyQuotesTable,
  CompanyTitleForm,
} from "./components";

export const CompanyEditPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "ADMIN";
  return (
    <div className="page-container">
        <CompanyTitleForm isEdit={isAdmin} />
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: 32,
        }}
      >
        <Col span={16}>
          <CompanyContactsTable isEdit={isAdmin} />
          <CompanyDealsTable
            style={{
              marginTop: 32,
            }}
            isEdit={isAdmin}
          />
          <CompanyQuotesTable
            style={{
              marginTop: 32,
            }}
            isEdit={isAdmin}
          />
          <CompanyNotes
            style={{
              marginTop: 32,
            }}
          />
        </Col>
        <Col span={8}>
          <CompanyInfoForm isEdit={isAdmin} />
        </Col>
      </Row>
    </div>
  );
};

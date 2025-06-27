import { registerEnumType } from "type-graphql";

export enum BusinessType {
  B2B = "B2B",
  B2C = "B2C", 
  B2G = "B2G"
}

export enum CompanySize {
  SMALL = "10-50",
  MEDIUM = "50-100",
  LARGE = "100-500",
  XLARGE = "500-2000",
  XXLARGE = "200-1000"
}

export enum Industry {
  TECH = "Tech",
  FINANCE = "Finance",
  HEALTH = "Health",
  RETAIL = "Retail",
  EDUCATION = "Education"
}

registerEnumType(BusinessType, {
  name: "BusinessType",
  description: "Business type enum",
});

registerEnumType(CompanySize, {
  name: "CompanySize", 
  description: "Company size enum",
});

registerEnumType(Industry, {
  name: "Industry",
  description: "Industry enum", 
}); 
import type { FC, PropsWithChildren } from "react";

import { ProductsFormModal } from "./components";

export const ProductsEditPage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ProductsFormModal action="edit" />
      {children}
    </>
  );
};

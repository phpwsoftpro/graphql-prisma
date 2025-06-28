import type { FC, PropsWithChildren } from "react";
import { ProductsFormModal } from "./components";

export const ProductsCreatePage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ProductsFormModal action="create" />
      {children}
    </>
  );
};

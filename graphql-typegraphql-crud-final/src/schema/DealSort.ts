import { InputType, Field, registerEnumType } from "type-graphql";
import { SortDirection } from "./SortDirection";
export enum DealSortField {
  title = "title",
  createdAt = "createdAt",
  // Thêm các trường khác nếu muốn sort
}

registerEnumType(DealSortField, { name: "DealSortField" });



registerEnumType(SortDirection, { name: "SortDirection" });

@InputType()
export class DealSort {
  @Field(() => DealSortField)
  field: DealSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
} 
import { InputType, Field, registerEnumType } from "type-graphql";
import { SortDirection } from "./SortDirection";
export enum DealStageSortField {
  title = "title",
  order = "order",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  // Add more sortable fields if needed
}

registerEnumType(DealStageSortField, {
  name: "DealStageSortField",
});



registerEnumType(SortDirection, {
  name: "SortDirection",
});

@InputType()
export class DealStageSort {
  @Field(() => DealStageSortField)
  field: DealStageSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
} 
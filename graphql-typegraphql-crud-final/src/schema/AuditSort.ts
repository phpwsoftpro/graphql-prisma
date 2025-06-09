import { InputType, Field } from "type-graphql";

@InputType()
export class AuditSort {
  @Field()
  field: string;

  @Field()
  direction: string;
}
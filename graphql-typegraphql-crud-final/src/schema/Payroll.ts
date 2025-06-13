import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Payroll {
  @Field(() => ID)
  id: string;

  @Field()
  employeeId: string;

  @Field()
  workedHours: number;

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;

  @Field({ nullable: true })
  approvedBy?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

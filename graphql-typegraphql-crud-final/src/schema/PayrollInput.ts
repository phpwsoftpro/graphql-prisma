import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePayrollInput {
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
}

@InputType()
export class UpdatePayrollInput {
  @Field({ nullable: true })
  employeeId?: string;

  @Field({ nullable: true })
  workedHours?: number;

  @Field({ nullable: true })
  periodStart?: Date;

  @Field({ nullable: true })
  periodEnd?: Date;

  @Field({ nullable: true })
  approvedBy?: string;
}

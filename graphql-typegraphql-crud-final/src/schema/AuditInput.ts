import { InputType, Field } from "type-graphql";

@InputType()
export class CreateAuditInput {
  @Field()
  action: string;

  @Field()
  targetEntity: string;

  @Field()
  targetId: number;

  @Field()
  changes: string;

  @Field({ nullable: true })
  userId?: number;
}

@InputType()
export class UpdateAuditInput {
  @Field({ nullable: true })
  action?: string;

  @Field({ nullable: true })
  targetEntity?: string;

  @Field({ nullable: true })
  targetId?: number;

  @Field({ nullable: true })
  changes?: string;

  @Field({ nullable: true })
  userId?: number;
}

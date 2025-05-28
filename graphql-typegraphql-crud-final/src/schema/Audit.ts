import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Audit {
  @Field(() => ID)
  id: number;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

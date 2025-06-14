import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { Changes } from "./Changes";

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

  @Field(() => [Changes])
  changes: Changes[];

  @Field({ nullable: true })
  userId?: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

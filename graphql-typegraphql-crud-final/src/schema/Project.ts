import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  createdById?: number;

  @Field({ nullable: true })
  startDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

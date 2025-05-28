import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Event {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  createdById?: number;

  @Field({ nullable: true })
  categoryId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

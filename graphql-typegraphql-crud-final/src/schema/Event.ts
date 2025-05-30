import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { EventCategory } from "./EventCategory";

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

  @Field(() => User, { nullable: true })
  createdBy?: User | null;

  @Field(() => EventCategory, { nullable: true })
  category?: EventCategory | null;

  @Field(() => [User])
  participants: User[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

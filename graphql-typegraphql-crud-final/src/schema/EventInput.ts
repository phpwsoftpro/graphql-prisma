import { Field, InputType } from "type-graphql";
import { Int } from "type-graphql";
@InputType()
export class EventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  createdById?: number;

  @Field(() => [Int], { nullable: true })
  participantIds?: number[];
}


@InputType()
export class CreateEventInput {
  @Field(() => EventInput)
  event: EventInput;
}
@InputType()
export class UpdateEventInput {
  @Field()
  id: number;
  @Field()
  update: EventInput;
}



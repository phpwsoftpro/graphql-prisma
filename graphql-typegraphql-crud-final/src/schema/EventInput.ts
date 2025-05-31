import { Field, InputType } from "type-graphql";

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
}

@InputType()
export class CreateEventInput {
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
}

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  startDate?: Date;

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
}

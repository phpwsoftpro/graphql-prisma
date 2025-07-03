import { InputType, Field } from "type-graphql";

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  createdById?: number;

  @Field({ nullable: true })
  startDate?: Date;

}

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  createdById?: number;

  @Field({ nullable: true })
  startDate?: Date;


}

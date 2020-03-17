import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserInputDto {
  @Field()
  public id: string;

  @Field({ nullable: true })
  public group: string;

  @Field(type => [String], { nullable: true })
  public subGroups: string[];

  @Field({ nullable: true })
  public locked: boolean;

  @Field({ nullable: true })
  public approved: boolean;
}

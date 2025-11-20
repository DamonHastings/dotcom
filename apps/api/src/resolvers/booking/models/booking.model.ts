import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BookingModel {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  leadId?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  startAt!: Date;

  @Field({ nullable: true })
  endAt?: Date;

  @Field({ nullable: true })
  timezone?: string;

  @Field({ nullable: true })
  provider?: string;

  @Field({ nullable: true })
  providerEventId?: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;
}

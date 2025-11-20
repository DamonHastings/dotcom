import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leadId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field()
  startAt!: Date;

  @Field({ nullable: true })
  @IsOptional()
  endAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  provider?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  providerEventId?: string;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ObjectType()
export class Restaur {
  @Field(type => String)
  name: string;

  @Field(type => Boolean)
  isVegan?: boolean;

  @Field(type => String)
  address: string;

  @Field(type => String)
  ownerName: string;
}

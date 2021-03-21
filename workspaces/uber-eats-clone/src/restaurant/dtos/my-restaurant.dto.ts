import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dot';
import { Restaurant } from '../entities/retaurant.entity';

@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
  @Field(type => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}

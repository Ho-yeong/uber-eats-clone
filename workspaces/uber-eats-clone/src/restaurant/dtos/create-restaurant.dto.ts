import { Field, InputType, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { Restaurant } from '../entities/retaurant.entity';
import { CoreOutput } from '../../common/dtos/output.dot';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ['name', 'coverImg', 'address']) {
  @Field(type => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}

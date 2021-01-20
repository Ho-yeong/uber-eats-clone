import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateReataurantDto } from './create-reataurant.dto';

@InputType()
export class UdpateRestaurantInputType extends PartialType(CreateReataurantDto) {}

@InputType()
export class UpdateRestaurantDto {
  @Field(type => Number)
  id: number;

  @Field(type => UdpateRestaurantInputType)
  data: UdpateRestaurantInputType;
}

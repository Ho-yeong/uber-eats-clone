import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginationInput, PaginationOutput } from '../../common/dtos/pagination.dto';
import { Restaurant } from '../entities/retaurant.entity';

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PaginationOutput {
  @Field(type => [Restaurant], { nullable: true })
  results?: Restaurant[];
}

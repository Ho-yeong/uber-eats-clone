import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/retaurant.entity';

@InputType()
export class CreateReataurantDto extends OmitType(Restaurant, ['id'], InputType) {}

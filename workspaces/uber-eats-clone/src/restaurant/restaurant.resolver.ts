import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/retaurant.entity';
import { CreateReataurantDto } from './dtos/create-reataurant.dto';
import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dtos/udpate-restaurant.dto';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restuarantService: RestaurantService) {}

  @Query(returns => [Restaurant])
  restaur(): Promise<Restaurant[]> {
    return this.restuarantService.getAll();
  }
  @Mutation(returns => Boolean)
  async createRestaurant(@Args('input') createRestaurantDto: CreateReataurantDto): Promise<boolean> {
    try {
      await this.restuarantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(returns => Boolean)
  async updateRestaurant(@Args('input') updateRestaurantDto: UpdateRestaurantDto): Promise<boolean> {
    try {
      await this.restuarantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

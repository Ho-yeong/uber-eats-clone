import { Inject, Injectable } from '@nestjs/common';
import { Restaurant } from './entities/retaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReataurantDto } from './dtos/create-reataurant.dto';
import { UpdateRestaurantDto } from './dtos/udpate-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@InjectRepository(Restaurant) private readonly restaurant: Repository<Restaurant>) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurant.find();
  }

  createRestaurant(createRestaurantDto: CreateReataurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurant.create(createRestaurantDto);
    return this.restaurant.save(newRestaurant);
  }

  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurant.update(id, { ...data });
    // update() 메소드는 id가 데이터베이스에 있는지 없는지 신경쓰지 않는다. 그냥 검색해서 바꿀뿐
  }
}

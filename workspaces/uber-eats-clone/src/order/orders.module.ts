import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Restaurant } from '../restaurant/entities/retaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from '../restaurant/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}

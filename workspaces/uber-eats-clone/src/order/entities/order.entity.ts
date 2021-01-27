import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurant/entities/retaurant.entity';
import { Dish } from '../../restaurant/entities/dish.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @ManyToOne(type => User, user => user.orders, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  customer?: User;

  @ManyToOne(type => User, user => user.rides, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  driver?: User;

  @ManyToOne(type => Restaurant, restaurant => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(type => Restaurant)
  restaurant: Restaurant;

  @ManyToMany(type => Dish)
  @JoinTable() // order own dishes
  @Field(type => [Dish])
  dishes: Dish[];

  @Column()
  @Field(type => Number)
  total: number;

  @Column({ type: 'enum', enum: OrderStatus })
  @Field(type => OrderStatus)
  status: OrderStatus;
}

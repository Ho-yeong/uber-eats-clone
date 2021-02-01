import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Dish, DishChoice, DishOption } from '../../restaurant/entities/dish.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItemOption extends CoreEntity {
  @Field(type => String)
  name: string;

  @Field(type => String, { nullable: true })
  choice?: string;

  @Field(type => Number, { nullable: true })
  extra?: number;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @Field(type => Dish)
  @ManyToOne(type => Dish, { nullable: true, onDelete: 'CASCADE' })
  dish: Dish;

  @Field(type => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}

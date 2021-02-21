import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurant/entities/retaurant.entity';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field(type => String)
  @Column()
  transactionId: string;

  @ManyToOne(type => User, user => user.payments)
  @Field(type => User)
  user: User;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @ManyToOne(type => Restaurant)
  @Field(type => Restaurant)
  restaurant: Restaurant;

  @RelationId((payment: Payment) => payment.restaurant)
  @Field(type => Int)
  restaurantId: number;
}

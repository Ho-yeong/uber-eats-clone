import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { LessThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePaymentInput, CreatePaymentOutput } from './dto/create-payment.dto';
import { Restaurant } from '../restaurant/entities/retaurant.entity';
import { GetPaymentOutput } from './dto/get-payment.dto';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }

      if (restaurant.ownerId !== owner.id) {
        return { ok: false, error: 'You are not allowed to do this' };
      }

      restaurant.isPromoted = true;
      const date = new Date();
      // getDate() => 현재 날짜의 '일' 을 준다 거기에 7일을 추가
      date.setDate(date.getDate() + 7);
      restaurant.promotedUntil = date;
      await this.restaurants.save(restaurant);
      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't create payment" };
    }
  }

  async getPayment(user: User): Promise<GetPaymentOutput> {
    try {
      const payments = await this.payments.find({ user: user });
      return { ok: true, payments };
    } catch (err) {
      return { ok: false, error: "Couldn't get payments" };
    }
  }

  // 매시간 30분에 체크
  @Cron('* 30 * * * *')
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });
    for (const restaurant of restaurants) {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    }
  }
}

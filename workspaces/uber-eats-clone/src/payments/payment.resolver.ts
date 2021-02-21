import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePaymentInput, CreatePaymentOutput } from './dto/create-payment.dto';
import { Role } from '../auth/role.decorator';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { GetPaymentOutput } from './dto/get-payment.dto';

@Resolver(of => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(returns => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }

  @Query(returns => GetPaymentOutput)
  @Role(['Owner'])
  getPayments(@AuthUser() user: User): Promise<GetPaymentOutput> {
    return this.paymentService.getPayment(user);
  }
}

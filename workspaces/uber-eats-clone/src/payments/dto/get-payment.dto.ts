import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dot';
import { Payment } from '../entities/payment.entity';

@ObjectType()
export class GetPaymentOutput extends CoreOutput {
  @Field(type => [Payment], { nullable: true })
  payments?: Payment[];
}

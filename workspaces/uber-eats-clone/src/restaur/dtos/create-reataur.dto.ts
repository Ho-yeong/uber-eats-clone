import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { Restaur } from '../entities/retaur.entity';

@InputType()
export class CreateReataurDto extends OmitType(Restaur, ['id'], InputType) {}

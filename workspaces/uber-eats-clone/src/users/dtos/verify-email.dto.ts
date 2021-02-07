import { CoreOutput } from '../../common/dtos/output.dot';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {}

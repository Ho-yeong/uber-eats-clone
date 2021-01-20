import { CoreOutput } from '../../common/dtos/output.dot';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(PickType(User, ['email', 'password'])) {}

@ObjectType()
export class EditProfileOut extends CoreOutput {}

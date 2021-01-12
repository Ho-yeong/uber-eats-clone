import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateReataurDto } from './create-reataur.dto';

@InputType()
export class UdpateRestaurInputType extends PartialType(CreateReataurDto) {}

@InputType()
export class UpdateRestaurDto {
  @Field(type => Number)
  id: number;

  @Field(type => UdpateRestaurInputType)
  data: UdpateRestaurInputType;
}

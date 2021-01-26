import { CoreOutput } from '../../common/dtos/output.dot';
import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@ObjectType()
export class AllCategoryOutput extends CoreOutput {
  @Field(type => [Category], { nullable: true })
  categories?: Category[];
}

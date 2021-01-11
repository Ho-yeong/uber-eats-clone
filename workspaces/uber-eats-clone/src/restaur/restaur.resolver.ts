import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaur } from './entities/retaur.entity';
import { CreateReataurDto } from './dtos/create-reataur.dto';

@Resolver(of => Restaur)
export class RestaurResolver {
  @Query(returns => [Restaur])
  restaur(@Args('veganOnly') veganOnly: boolean): Restaur[] {
    console.log(veganOnly);
    return [];
  }
  @Mutation(returns => Boolean)
  createRestaur(@Args() createRestaurDto: CreateReataurDto): boolean {
    console.log(createRestaurDto);
    return true;
  }
}

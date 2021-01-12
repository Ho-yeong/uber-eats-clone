import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaur } from './entities/retaur.entity';
import { CreateReataurDto } from './dtos/create-reataur.dto';
import { RestaurService } from './restaur.service';
import { UpdateRestaurDto } from './dtos/udpate-restaur.dto';

@Resolver(of => Restaur)
export class RestaurResolver {
  constructor(private readonly restuarService: RestaurService) {}

  @Query(returns => [Restaur])
  restaur(): Promise<Restaur[]> {
    return this.restuarService.getAll();
  }
  @Mutation(returns => Boolean)
  async createRestaur(@Args('input') createRestaurDto: CreateReataurDto): Promise<boolean> {
    try {
      await this.restuarService.createRestaur(createRestaurDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(returns => Boolean)
  async updateRestaur(@Args('input') updateRestaurDto: UpdateRestaurDto): Promise<boolean> {
    try {
      await this.restuarService.updateRestaur(updateRestaurDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

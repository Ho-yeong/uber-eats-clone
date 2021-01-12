import { Module } from '@nestjs/common';
import { RestaurResolver } from './restaur.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaur } from './entities/retaur.entity';
import { RestaurService } from './restaur.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaur])],
  providers: [RestaurResolver, RestaurService],
})
export class RestaurModule {}

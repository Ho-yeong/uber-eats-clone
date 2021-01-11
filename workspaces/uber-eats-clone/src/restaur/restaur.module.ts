import { Module } from '@nestjs/common';
import { RestaurResolver } from './restaur.resolver';

@Module({
  providers: [RestaurResolver],
})
export class RestaurModule {}

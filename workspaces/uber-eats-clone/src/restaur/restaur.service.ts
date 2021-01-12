import { Inject, Injectable } from '@nestjs/common';
import { Restaur } from './entities/retaur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReataurDto } from './dtos/create-reataur.dto';
import { UpdateRestaurDto } from './dtos/udpate-restaur.dto';

@Injectable()
export class RestaurService {
  constructor(@InjectRepository(Restaur) private readonly restaur: Repository<Restaur>) {}

  getAll(): Promise<Restaur[]> {
    return this.restaur.find();
  }

  createRestaur(createRestaurDto: CreateReataurDto): Promise<Restaur> {
    const newRestaur = this.restaur.create(createRestaurDto);
    return this.restaur.save(newRestaur);
  }

  updateRestaur({ id, data }: UpdateRestaurDto) {
    return this.restaur.update(id, { ...data });
    // update() 메소드는 id가 데이터베이스에 있는지 없는지 신경쓰지 않는다. 그냥 검색해서 바꿀뿐
  }
}

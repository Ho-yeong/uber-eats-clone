import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

// @InputType({ isAbstract: true }) // dto로 extends 될때 InputType 으로 되어서 간다, 이 엔티티를 바로 사용한다는 뜻이아니고 복사해서 InputType으로써 사용하겠다는 뜻
// dto 에서도 InputType 의 argument 를 하나 더 추가 해줘서 같은 역할을 할 수 있다.
@ObjectType() // graphql
@Entity() // typeorm - database
export class Restaur {
  @Field(type => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(type => Boolean, { nullable: true })
  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  isVegan?: boolean;

  @Field(type => String, { defaultValue: 'busan' })
  @Column()
  @IsString()
  address: string;
}

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurant/entities/retaurant.entity';
import { Category } from './restaurant/entities/category.entity';
import { Dish } from './restaurant/entities/dish.entity';
import { OrdersModule } from './order/orders.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MyLoggerModule } from './my-logger/my-logger.module';

//test
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().valid().required(),
        DB_PORT: Joi.string().valid().required(),
        DB_USERNAME: Joi.string().valid().required(),
        DB_PASSWORD: Joi.string().valid().required(),
        DB_NAME: Joi.string().valid().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [Restaurant, Category, User, Verification, Dish, Order, OrderItem, Payment],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return { token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY] };
      },
    }),
    RestaurantModule,
    UsersModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    ScheduleModule.forRoot(),
    MyLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// subscription 은 HTTP 프로토콜을 사용하지 않기 때문에 미들웨어에서 토큰 인증을 할 수 없음
// export class AppModule implements NestModule {
// main.ts에 app.middleware 를 사용해서 적용시키는 방법이랑 똑같다
// 차이점은 밑의 설정에 path 에 적용시키고 싶은 범위를 설정할 수 있다.
// middleware 가 함수일때만 main.ts에 적용가능
// configure 은 class 일때도 적용 가능하다.
// configure(consumer: MiddlewareConsumer) {
//   consumer.apply(JwtMiddleware).forRoutes({
//     path: '/graphql',
//     method: RequestMethod.POST,
//   });
// }
// }

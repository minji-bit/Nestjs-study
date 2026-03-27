import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BoardModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}

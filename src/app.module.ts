import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [BoardModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}

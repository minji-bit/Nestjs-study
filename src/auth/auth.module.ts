import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RtStrategy } from 'src/common/strategies/rt.strategy';
import { AtStrategy } from 'src/common/strategies/at.strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy,PrismaService]
})
export class AuthModule {}

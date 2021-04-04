import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTGuard } from '../auth/jwt.guard';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RefreshTokenRepository, RefreshTokenRepositoryProvider } from './refresh-token.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RefreshTokenRepository])],
  controllers: [UserController],
  providers: [
    UserService,
    RefreshTokenRepositoryProvider, 
    JwtStrategy, 
    JWTGuard
  ],
  exports: [UserService, RefreshTokenRepositoryProvider]
})
export class UserModule {}

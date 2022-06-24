import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccesstokenStrategy,
  LocalStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
          signOptions: {
            expiresIn: parseInt(
              configService.get<string>('JWT_ACCESS_TOKEN_EXPIRESIN'),
            ),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AccesstokenStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}

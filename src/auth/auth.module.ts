import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';
import { UserOtp } from './entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOtp]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '5h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, MailService],
  exports: [JwtModule, JwtAuthGuard, MailService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.getOrThrow<string>('SQL_HOST'),
          username: configService.getOrThrow<string>('SQL_USER'),
          password: configService.getOrThrow<string>('SQL_PASSWORD'),
          database: configService.getOrThrow<string>('SQL_DB'),
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}

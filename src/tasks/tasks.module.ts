import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Tasks } from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tasks]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

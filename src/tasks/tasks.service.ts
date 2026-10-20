import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTaskDto } from './dto/CreateTaskDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Tasks } from './entities/task.entity';
import { apiResponse } from 'src/common/utils/api-response';
import { GetTasksQueryDto } from './dto/getTaskDto';
import { TimeLog } from './entities/time-log.entity';
import { TaskStatus, WhereType } from './types/Task.type';
import { FindOptionsWhere, IsNull, Repository, DataSource } from 'typeorm';

@Injectable()
export class TasksService {
  public logger = new Logger(TasksService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tasks) private readonly taskRepository: Repository<Tasks>,
    private readonly dataSource: DataSource,
  ) {}

  async createNewTask(createTaskDto: CreateTaskDto, userId: string) {
    try {
      // Here Checking the user account is active or not
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
          deleted_at: IsNull(),
        },
        select: {
          id: true,
        },
      });

      // if inactive throwing the error message
      if (!user) {
        throw new UnauthorizedException('Please sign in again');
      }

      const task = this.taskRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        taskStatus: TaskStatus.Pending,
        userId: user.id,
      });

      const response = await this.taskRepository.save(task);
      return apiResponse('successfully created a task', HttpStatus.CREATED, {
        response,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        'Failed to create task',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to create task');
    }
  }

  async getTasksDetails(userId: string, query: GetTasksQueryDto) {
    try {
      const { status, page, limit } = query;

      const whereValue: WhereType = {
        userId,
        deletedAt: IsNull(),
      };

      if (status) {
        whereValue['taskStatus'] = status;
      }

      // get All the task
      const [getTasks, count] = await this.taskRepository.findAndCount({
        where: whereValue,
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: Number(query.page) * 10,
      });
      console.log(getTasks);

      return apiResponse('Tasks fetched successfully', HttpStatus.OK, {
        tasks: getTasks,
        pagination: {
          page,
          limit,
          count,
          totalPages: Math.ceil(count / limit),
          hasNextPage: page * limit < count,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        'Failed to create task',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to create task');
    }
  }

  async startTimer(taskId: string, userId: string) {
    try {
      return this.dataSource.transaction(async (manager) => {
        const taskRepository = manager.getRepository(Tasks);
        const timeLogRepository = manager.getRepository(TimeLog);

        // Check ownership and lock the task until this transaction finishes.
        const task = await taskRepository.findOne({
          where: {
            id: taskId,
            userId,
            deletedAt: IsNull(),
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!task) {
          throw new NotFoundException('Task not found');
        }

        if (task.taskStatus === TaskStatus.Completed) {
          throw new ConflictException(
            'You cannot start a timer for a completed task',
          );
        }

        // A session with no end time is still running.
        const runningLog = await timeLogRepository.findOne({
          where: {
            taskId: task.id,
            endedAt: IsNull(),
            deleted_at: IsNull(),
          },
        });

        if (runningLog) {
          throw new ConflictException(
            'A timer is already running for this task',
          );
        }

        // Start and resume both create a new session.
        const timeLog = timeLogRepository.create({
          taskId: task.id,
          startedAt: new Date(),
          endedAt: null,
          durationInSeconds: 0,
        });

        const savedTimeLog = await timeLogRepository.save(timeLog);

        // Here i'm updating the task to inprogress
        task.taskStatus = TaskStatus.InProgress;
        await taskRepository.save(task);

        return {
          message: 'Timer started successfully',
          data: {
            taskId: task.id,
            taskStatus: task.taskStatus,
            isRunning: true,
            timeLog: savedTimeLog,
          },
        };
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        'Failed to create task',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to create task');
    }
  }
}

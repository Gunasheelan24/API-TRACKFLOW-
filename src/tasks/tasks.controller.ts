import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/CreateTaskDto';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';
import { GetTasksQueryDto } from './dto/getTaskDto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create-task')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.createNewTask(createTaskDto, request.user.sub);
  }

  @Get('get-tasks')
  @UseGuards(JwtAuthGuard)
  getTaskDetails(
    @Req() request: AuthenticatedRequest,
    @Query() query: GetTasksQueryDto,
  ) {
    return this.tasksService.getTasksDetails(request?.user.sub, query);
  }

  @Post('start-timer/:taskId')
  @UseGuards(JwtAuthGuard)
  startTimer(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.startTimer(taskId, request.user.sub);
  }
}
